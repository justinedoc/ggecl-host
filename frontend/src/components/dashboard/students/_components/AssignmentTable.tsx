import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { TABLE_ACTIONS, TableActionName } from "../utils/tableActions";
import { Assignment } from "../pages/Assignment";

type AssignmentTableProps = {
  totalAssignments: number;
  onHandleTableAction: (
    actionName: TableActionName,
    assignment: Assignment,
  ) => void;
  paginatedData: Assignment[];
};

function AssignmentTable({
  totalAssignments,
  onHandleTableAction,
  paginatedData,
}: AssignmentTableProps) {
  return (
    <Table>
      <TableHeader className="rounded-lg border bg-gray-50 dark:bg-gray-800">
        <TableRow>
          <TableHead className="font-semibold text-gray-800 dark:text-gray-100">
            S/N
          </TableHead>
          <TableHead className="font-semibold text-gray-800 dark:text-gray-100">
            Title
          </TableHead>
          <TableHead className="font-semibold text-gray-800 dark:text-gray-100">
            Course
          </TableHead>
          <TableHead className="font-semibold text-gray-800 dark:text-gray-100">
            Due Date
          </TableHead>
          <TableHead className="font-semibold text-gray-800 dark:text-gray-100">
            Status
          </TableHead>
          <TableHead className="text-right font-semibold text-gray-800 dark:text-gray-100">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((assignment, i) => (
          <TableRow key={assignment.id} className="border-b">
            <TableCell className="font-medium whitespace-nowrap">
              {i + 1}
            </TableCell>
            <TableCell className="font-medium whitespace-nowrap">
              {assignment.title}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {assignment.course}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {assignment.dueDate}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              <span
                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  assignment.status === "Completed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : assignment.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" // Progress
                }`}
              >
                {assignment.status}
              </span>
            </TableCell>
            <TableCell className="text-right whitespace-nowrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    aria-label={`Actions for ${assignment.title}`}
                  >
                    <EllipsisVertical size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="left"
                  align="start"
                  className="w-auto rounded-md border p-1 shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  {TABLE_ACTIONS.map((action) => (
                    <Button
                      onClick={() =>
                        onHandleTableAction(action.name, assignment)
                      }
                      key={action.name}
                      variant="ghost"
                      className="flex w-full items-center justify-start gap-2 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label={`${action.name} ${assignment.title}`}
                    >
                      <action.icon size={16} />
                      <span>{action.name}</span>
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
        {paginatedData.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10 text-center text-gray-500 dark:text-gray-400"
            >
              No assignments found matching your filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell
            colSpan={6}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Total Assignments: {totalAssignments}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export default AssignmentTable;
