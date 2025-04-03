import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
//   TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { FaSearch } from "react-icons/fa";

const orders = [
  {
    id: "SKN1200",
    course: "Master Front-End Development",
    customer: "Robert Fox",
    date: "01.01.2022",
    status: "Completed",
    price: "$399.00",
  },
  {
    id: "SKN1233",
    course: "Learn More About Typography",
    customer: "Brooklyn Simmons",
    date: "01.01.2022",
    status: "Canceled",
    price: "$2,999.00",
  },
  {
    id: "KBN1243",
    course: "Advance UI/UX Design",
    customer: "Jacob Jones",
    date: "02.01.2022",
    status: "Pending",
    price: "$2,699.00",
  },
  {
    id: "SKN1200",
    course: "Master Front-End Development",
    customer: "Robert Fox",
    date: "01.01.2022",
    status: "Completed",
    price: "$399.00",
  },
  {
    id: "SKN1233",
    course: "Learn More About Typography",
    customer: "Brooklyn Simmons",
    date: "01.01.2022",
    status: "Canceled",
    price: "$2,999.00",
  },
  {
    id: "KBN1243",
    course: "Advance UI/UX Design",
    customer: "Jacob Jones",
    date: "02.01.2022",
    status: "Pending",
    price: "$2,699.00",
  },
];

export default function OrdersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const totalPages = Math.ceil(orders.length / rowsPerPage);
  const paginatedData = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="container mx-auto py-8 px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 whitespace-nowrap">
      {/* Header */}
      <div className="md:grid grid-cols-1 md:grid-cols-2 flex flex-col justify-between items-start md:items-center mb-6 px-4">
        <div>
          <h1 className="text-4xl font-bold mb-5">Payments</h1>
          <p>View and manage users and payments</p>
        </div>
        <div className="flex gap-4 items-center justify-start md:flex-row flex-row-reverse md:justify-end">
          <FaSearch className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-[2rem] text-gray-700 dark:text-gray-300" />
          <select
            className="p-2 bg-transparent outline-none border-none shadow-none"
          >
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="All"
            >
              All Status
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="Pending"
            >
              Pending
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="Completed"
            >
              Completed
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value="progress"
            >
              Progress
            </option>
          </select>
          {/* Filter by Date */}
          <input
            type="date"
            className="p-2 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <Table className="w-full">
        <TableHeader className="bg-gray-100 dark:bg-gray-800">
          <TableRow>
            <TableHead>
              <input type="checkbox" className="form-checkbox" />
            </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.map((order, index) => (
            <TableRow key={index} className="border">
              <TableCell>
                <input type="checkbox" className="form-checkbox" />
              </TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.course}</TableCell>
              <TableCell className="font-semibold">{order.customer}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-bold rounded-md ${
                    order.status === "Completed"
                      ? "bg-green-100 dark:bg-green-900 dark:text-green-200 text-green-600"
                      : order.status === "Pending"
                      ? "bg-orange-100 dark:bg-orange-900 dark:text-orange-200 text-orange-600"
                      : "bg-red-100 dark:bg-red-900 dark:text-red-200 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </TableCell>
              <TableCell className="font-semibold">{order.price}</TableCell>
              <TableCell>
                <MoreVertical className="cursor-pointer" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div>
          <span className="mr-2">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border rounded-lg p-2 bg-transparent outline-none border-none shadow-none"
          >
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={3}
            >
              3
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={5}
            >
              5
            </option>
            <option
              className="dark:bg-gray-900 bg-gray-100 outline-none"
              value={10}
            >
              10
            </option>
          </select>
          <span className="ml-2">rows</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded-md ${
                currentPage === i + 1 ? "bg-gray-300 dark:bg-gray-800" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 border rounded-md disabled:opacity-50 "
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}