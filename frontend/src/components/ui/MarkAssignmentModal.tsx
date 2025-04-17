import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Assignment } from "@/components/dashboard/admin/pages/AssignmentAd"; // Import the Assignment interface

// Define the Grade type
type Grade = "A" | "B" | "C" | "D" | null;

interface MarkAssignmentModalProps {
  assignment: Assignment | null; // Now TypeScript knows what 'Assignment' is
  isOpen: boolean;
  onClose: () => void;
  onGradeSubmitted: (assignmentId: string, grade: Grade) => void;
}

const MarkAssignmentModal: React.FC<MarkAssignmentModalProps> = ({
  assignment,
  isOpen,
  onClose,
  onGradeSubmitted,
}) => {
  const [grade, setGrade] = useState<Grade>(null);

  if (!assignment) {
    return null;
  }

  const handleGradeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGrade(event.target.value as Grade);
  };

  const handleSubmitGrade = () => {
    if (assignment._id && grade) {
      onGradeSubmitted(assignment._id, grade);
      onClose(); // Close the modal after submitting the grade
    } else {
      alert("Please select a grade before submitting.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Mark Assignment</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* View Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">Assignment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Title:</p>
                <p className="font-semibold">{assignment.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Course:</p>
                <p className="font-semibold">{assignment.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due Date:</p>
                <p className="font-semibold">{assignment.dueDate}</p>
              </div>
              {assignment.pdfUrl && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Submission:</p>
                  <Button size="sm" onClick={() => window.open(assignment.pdfUrl, "_blank")}>
                    View File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Grade Section */}
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Grade Assignment</h3>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="grade" className="text-sm text-gray-500 dark:text-gray-400">
                Select Grade:
              </label>
              <select
                id="grade"
                value={grade || ""}
                onChange={handleGradeChange}
                className="rounded border bg-transparent py-2 px-3 text-sm"
              >
                <option value="">-- Select Grade --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmitGrade} disabled={!grade}>
            Submit Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAssignmentModal;