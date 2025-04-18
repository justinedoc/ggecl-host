import { useState, useMemo, useCallback, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssignmentModal from "../_components/AssignmentModal";
import AssignmentTable from "../_components/AssignmentTable";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { validateFile } from "@/utils/validateFile";
import { UploadOverlay } from "@/components/ui/UploadOverlay";
import { useCreateAssignmentCloudinarySig } from "../hooks/useCreateAssignmentCloudinarySig";
import { useMarkAssignmentSubmissionComplete } from "../hooks/useMarkAssignmentSubmissionComplete";
import { uploadToCloudinary } from "@/api/services/uploadToCloudinary";
import { SAssignment } from "@/utils/trpc";
import { useAssignments } from "../hooks/useAssignments";

// Define the filter options
const STATUS_OPTIONS: ("All" | Capitalize<SAssignment["status"]>)[] = [
  "All",
  "Pending",
  "Submitted",
  "Graded",
];
const ROWS_PER_PAGE_OPTIONS = [3, 5, 10];

export default function AssignmentList() {
  // File upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentToSubmitFor, setAssignmentToSubmitFor] =
    useState<SAssignment | null>(null);

  // Table & filter state
  const [filterStatus, setFilterStatus] =
    useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [filterDate, setFilterDate] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    ROWS_PER_PAGE_OPTIONS[1],
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<SAssignment | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createSignatureCloudinary } = useCreateAssignmentCloudinarySig();
  const { markSubmissionComplete } = useMarkAssignmentSubmissionComplete();
  const { assignments } = useAssignments();

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter(
        (a) =>
          filterStatus === "All" ||
          a.status.toLowerCase() === filterStatus.toLowerCase(),
      )
      .filter((a) => {
        if (!filterDate) return true;
        const due = format(new Date(a.dueDate), "yyyy-MM-dd");
        return due === filterDate;
      })
      .filter((a) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          a.title.toLowerCase().includes(term) ||
          (a.course as { title: string }).title.toLowerCase().includes(term)
        );
      });
  }, [assignments, filterStatus, filterDate, searchTerm]);

  // Pagination
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredAssignments.length / rowsPerPage)),
    [filteredAssignments, rowsPerPage],
  );

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAssignments.slice(start, start + rowsPerPage);
  }, [filteredAssignments, currentPage, rowsPerPage]);

  // File input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setUploadProgress(0);

    if (!assignmentToSubmitFor || !file) {
      toast.error("Please select an assignment before uploading.");
      return;
    }

    const { valid, error: validationError } = validateFile(file, "pdf");
    if (!valid) {
      toast.error(validationError);
      return;
    }

    submitToCloud(assignmentToSubmitFor, file);
  };

  // Upload handler
  const submitToCloud = useCallback(
    async (assignment: SAssignment, file: File) => {
      setIsSubmitting(true);
      setUploadProgress(0);

      try {
        const sig = await createSignatureCloudinary({
          assignmentId: assignment._id.toString(),
          originalFileName: file.name,
        });

        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", sig.apiKey);
        fd.append("timestamp", String(sig.timestamp));
        fd.append("folder", sig.folder);
        fd.append("public_id", sig.publicId);
        fd.append("signature", sig.signature);
        fd.append("resource_type", "raw");

        const url = `https://api.cloudinary.com/v1_1/${sig.cloudName}/raw/upload`;
        const { result } = await uploadToCloudinary({
          cloudinaryUrl: url,
          formData: fd,
          callback: setUploadProgress,
        });

        if (result.status < 200 || result.status >= 300) {
          throw new Error(result.statusText);
        }

        await markSubmissionComplete(
          {
            assignmentId: assignment._id.toString(),
            publicId: result.data.public_id,
            fileName: file.name,
            fileSize: result.data.bytes,
            fileType: file.type,
            fileUrl: result.data.secure_url,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                toast.success("Assignment submitted for marking");
                closeModal();
              }
            },
            onSettled: () => {
              setTimeout(() => {
                setIsSubmitting(false);
                setUploadProgress(0);
                setAssignmentToSubmitFor(null);
              }, 1500);
            },
          },
        );
      } catch (err) {
        let message = "Upload failed.";
        if (err instanceof AxiosError && err.response?.data?.error?.message) {
          message = err.response.data.error.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        toast.error(message);
      }
    },
    [createSignatureCloudinary, markSubmissionComplete],
  );

  // Table action handlers
  const handleView = useCallback((assignment: SAssignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  }, []);

  const handleUploadAction = useCallback((assignment: SAssignment) => {
    if (assignment.status === "submitted") {
      toast.info("Already submitted.");
      return;
    }
    setAssignmentToSubmitFor(assignment);
    fileInputRef.current?.click();
  }, []);

  const handleTableAction = useCallback(
    (action: string, assignment: SAssignment) => {
      if (action === "View") handleView(assignment);
      if (action === "Upload") handleUploadAction(assignment);
    },
    [handleView, handleUploadAction],
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAssignment(null), 300);
  }, []);

  // Pagination controls
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    },
    [totalPages],
  );

  return (
    <div className="container mx-auto bg-white px-4 py-8 text-gray-800 md:px-10 dark:bg-gray-900 dark:text-gray-200">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="hidden"
        disabled={isSubmitting}
      />

      {isSubmitting && (
        <UploadOverlay
          progress={uploadProgress}
          showSuccess={uploadProgress === 100 && !isSubmitting}
        />
      )}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Assignments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and manage your course assignments.
          </p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative">
            <Search className="absolute top-2 left-2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded border bg-transparent p-2 pl-8 text-sm"
              aria-label="Search assignments"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="rounded border bg-transparent p-2 text-sm"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded border bg-transparent p-2 text-sm"
            aria-label="Filter by due date"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <AssignmentTable
          totalAssignments={filteredAssignments.length}
          onHandleTableAction={handleTableAction}
          paginatedData={paginatedData}
        />
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-sm">
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded border bg-transparent p-1"
            aria-label="Select number of rows per page"
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          isOpen={isModalOpen}
          onClose={closeModal}
          onUpload={handleUploadAction}
        />
      )}
    </div>
  );
}
