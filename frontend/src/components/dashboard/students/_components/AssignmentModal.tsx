import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { SAssignment } from "@/utils/trpc";
import { format } from "date-fns";
import { Upload } from "lucide-react";

type AssignmentModalProps = {
  assignment: SAssignment;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (assignment: SAssignment) => void;
};

export default function AssignmentModal({
  assignment,
  isOpen,
  onClose,
  onUpload,
}: AssignmentModalProps) {
  const handleUploadClick = () => {
    onUpload(assignment);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-semibold">
            {assignment.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Course: {assignment.course.title} | Due:{" "}
            {format(new Date(assignment.dueDate), "dd-MM-yyyy")} | Status:{" "}
            {assignment.status}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 text-sm text-gray-700 dark:text-gray-300">
          <p>{assignment.question}</p>
        </div>

        <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadClick}
            aria-label={`Upload assignment ${assignment.title}`}
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Submission
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
