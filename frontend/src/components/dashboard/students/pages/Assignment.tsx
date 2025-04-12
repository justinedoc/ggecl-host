import { useState, useMemo, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import AssignmentModal from "../_components/AssignmentModal";
import AssignmentTable from "../_components/AssignmentTable";
import { TableActionName } from "../utils/tableActions";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";
import axiosInstance from "@/api/client";
import { AxiosError } from "axios";

type AssignmentStatus = "Pending" | "Completed" | "Progress";

export type Assignment = {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: AssignmentStatus;
};

const assignmentsData: Assignment[] = [
  {
    id: 1,
    title: "Math Homework",
    course: "Algebra",
    dueDate: "2025-03-05",
    status: "Pending",
  },
];

const ROWS_PER_PAGE_OPTIONS = [3, 5, 10];
const STATUS_OPTIONS: ["All", ...AssignmentStatus[]] = [
  "All",
  "Pending",
  "Completed",
  "Progress",
];

function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 22 * 1024 * 1024; // 22MB
  if (file.type !== "application/pdf") {
    return {
      valid: false,
      error: "Invalid file format. Please select a PDF file.",
    };
  }
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`,
    };
  }
  return { valid: true };
}

function UploadOverlay({
  progress,
  showSuccess,
}: {
  progress: number;
  showSuccess: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50">
      <div className="w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        {showSuccess ? (
          <h2 className="mb-4 text-center text-xl font-semibold text-green-600">
            Upload Successful!
          </h2>
        ) : (
          <>
            <h2 className="mb-2 text-center text-xl font-semibold">
              Uploading Assignment
            </h2>
            <div className="w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-4 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-center text-sm">{progress}%</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AssignmentList() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [assignmentToSubmitFor, setAssignmentToSubmitFor] =
    useState<Assignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<AssignmentStatus | "All">(
    "All",
  );
  const [filterDate, setFilterDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createSignatureCloudinary } = useMutation(
    trpc.assignment.createCloudinarySignature.mutationOptions(),
  );

  const { mutateAsync: markSubmissionComplete } = useMutation(
    trpc.assignment.markSubmissionComplete.mutationOptions({
      onSuccess: (data) => {
        if (data.success) {
          toast.success("Assignment submitted for marking");
          // Invalidate queries ...
        }
      },
    }),
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadProgress(0);
    if (!file) return;

    if (!assignmentToSubmitFor) {
      console.error("Upload triggered without an assignment context.");
      e.target.value = "";
      setAssignmentToSubmitFor(null);
      return;
    }

    const { valid, error } = validateFile(file);
    if (!valid) {
      toast.error(error);
    } else {
      handleSubmitAssignment(assignmentToSubmitFor, file);
    }

    e.target.value = "";
  };

  const handleSubmitAssignment = useCallback(
    async (assignment: Assignment, selectedFile: File) => {
      if (!selectedFile) {
        toast.error("Please select a PDF file to upload.");
        return;
      }
      setIsSubmitting(true);
      setUploadProgress(0);

      try {
        const signatureData = await createSignatureCloudinary({
          assignmentId: assignment.title,
          originalFileName: selectedFile.name,
        });

        const { signature, timestamp, apiKey, cloudName, folder, publicId } =
          signatureData;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);
        formData.append("public_id", publicId);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

        const cloudinaryResponse = await axiosInstance.post(
          cloudinaryUrl,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) /
                  (progressEvent.total ?? selectedFile.size),
              );
              setUploadProgress(percentCompleted);
            },
          },
        );

        if (
          cloudinaryResponse.status < 200 ||
          cloudinaryResponse.status >= 300
        ) {
          toast.error(
            `Assignment upload failed: ${cloudinaryResponse.statusText}`,
          );
          return;
        }

        await markSubmissionComplete({
          assignmentId: assignment.title,
          publicId: cloudinaryResponse.data.public_id,
          version: cloudinaryResponse.data.version,
          signature: cloudinaryResponse.data.signature,
          fileName: selectedFile.name,
          fileSize: cloudinaryResponse.data.bytes,
          fileType:
            cloudinaryResponse.data.resource_type === "raw"
              ? selectedFile.type
              : cloudinaryResponse.data.format,
          fileUrl: cloudinaryResponse.data.secure_url,
        });

        console.log("Cloudinary Upload Result:", cloudinaryResponse.data);
      } catch (err) {
        console.error("Submission Process Error:", err);
        let message = "An unexpected error occurred.";
        if (err instanceof AxiosError && err.response?.data?.error?.message) {
          message = `Upload failed: ${err.response.data.error.message}`;
        } else if (err instanceof Error) {
          message = err.message;
        } else if (typeof err === "string") {
          message = err;
        }
        toast.error(`Submission failed: ${message}`);
      } finally {
        // Briefly show success state before hiding the overlay.
        setTimeout(() => {
          setIsSubmitting(false);
          setUploadProgress(0);
        }, 1500);
      }
    },
    [createSignatureCloudinary, markSubmissionComplete],
  );

  const filteredAssignments = useMemo(() => {
    return assignmentsData
      .filter((a) =>
        filterStatus === "All" ? true : a.status === filterStatus,
      )
      .filter((a) => (filterDate ? a.dueDate === filterDate : true));
  }, [filterStatus, filterDate]);

  const totalPages = Math.ceil(filteredAssignments.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredAssignments.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAssignments, currentPage, rowsPerPage]);

  const handleViewAssignment = useCallback((assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  }, []);

  const handleUploadAction = useCallback((assignment: Assignment) => {
    console.log("Initiating upload for:", assignment);
    setAssignmentToSubmitFor(assignment);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleTableAction = useCallback(
    (actionName: TableActionName, assignment: Assignment) => {
      switch (actionName) {
        case "View":
          handleViewAssignment(assignment);
          break;
        case "Upload":
          handleUploadAction(assignment);
          break;
        default:
          break;
      }
    },
    [handleViewAssignment, handleUploadAction],
  );

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAssignment(null), 300);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages],
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(event.target.value));
      setCurrentPage(1);
    },
    [],
  );

  const handleStatusFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterStatus(event.target.value as AssignmentStatus | "All");
      setCurrentPage(1);
    },
    [],
  );

  const handleDateFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterDate(event.target.value);
      setCurrentPage(1);
    },
    [],
  );

  return (
    <div className="container mx-auto bg-white px-4 py-8 text-gray-800 md:px-10 dark:bg-gray-900 dark:text-gray-200">
      {/* Hidden file input for PDF uploads */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />

      {/* Upload overlay modal */}
      {isSubmitting && (
        <UploadOverlay
          progress={uploadProgress}
          showSuccess={uploadProgress === 100}
        />
      )}

      <div className="mb-6 flex flex-col items-start justify-between gap-4 px-1 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Assignments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and manage your course assignments.
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center justify-start gap-2 md:w-auto md:justify-end">
          <Button variant="ghost" size="icon" aria-label="Search assignments">
            <Search className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>
          <select
            value={filterStatus}
            onChange={handleStatusFilterChange}
            className="rounded border bg-transparent p-2 text-sm"
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((status) => (
              <option
                key={status}
                className="bg-gray-100 dark:bg-gray-800"
                value={status}
              >
                {status === "All" ? "All Status" : status}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilterChange}
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
            onChange={handleRowsPerPageChange}
            className="rounded border bg-transparent p-1"
            aria-label="Select number of rows per page"
          >
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
              <option
                key={option}
                className="bg-gray-100 dark:bg-gray-800"
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className="h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Go to next page"
            className="h-8 w-8"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpload={handleUploadAction}
        />
      )}
    </div>
  );
}
