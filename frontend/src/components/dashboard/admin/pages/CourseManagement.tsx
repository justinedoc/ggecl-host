import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const data = [
  { name: "Jan", chosen: 1000, last: 4000 },
  { name: "Feb", chosen: 3000, last: 6000 },
  { name: "Mar", chosen: 2000, last: 5000 },
  { name: "Apr", chosen: 5000, last: 7000 },
  { name: "May", chosen: 4000, last: 6000 },
  { name: "Jun", chosen: 6000, last: 8000 },
  { name: "Jul", chosen: 7000, last: 9000 },
  { name: "Aug", chosen: 6000, last: 7000 },
  { name: "Sep", chosen: 5000, last: 6000 },
  { name: "Oct", chosen: 7000, last: 8000 },
  { name: "Nov", chosen: 6000, last: 7000 },
  { name: "Dec", chosen: 5000, last: 6000 },
];

const offers = [
  { name: "New Offer", code: "BOGO22", amount: "$21", status: "Expired" },
  { name: "Buy 1 get 1", code: "XMAS10", amount: "10%", status: "Draft" },
  { name: "Summer Sale", code: "BFA", amount: "$25", status: "Active" },
  { name: "Offer", code: "HAPPY20", amount: "20%", status: "Active" },
  { name: "New Offer", code: "TOUR10", amount: "10%", status: "Scheduled" },
];



export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("Daily");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">1 Jan, 2025 - 30 Dec, 2025</h2>
        <Select onValueChange={setSelectedPeriod} value={selectedPeriod}>
          <SelectTrigger className="border px-3 py-2 rounded-md flex items-center gap-2">
            <SelectValue>{selectedPeriod}</SelectValue>
            <ChevronDownIcon className="w-4 h-4" />
          </SelectTrigger>
          <SelectContent className="border rounded-md bg-white shadow-md">
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-md shadow-md min-w-full overflow-x-scroll dark:bg-gray-800">
        <LineChart width={1200} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="chosen" stroke="#3366FF" />
          <Line type="monotone" dataKey="last" stroke="#22C55E" />
        </LineChart>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 ">
        <div className="p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
          <h3 className="text-xl font-bold">$200.00</h3>
          <p className="text-gray-500">Total Redeemed</p>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
          <h3 className="text-xl font-bold">551</h3>
          <p className="text-gray-500">Total Coupons</p>
        </div>
        <div className="p-4 bg-white rounded-md shadow-md dark:bg-gray-800">
          <h3 className="text-xl font-bold">$8,723</h3>
          <p className="text-gray-500">Redeemed Amount</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2 w-full justify-between">
        <Input placeholder="Search User" className="border px-3 py-2 rounded-md w-64" />
        <button className="border p-2 rounded-md bg-gray-100">
          <FilterIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <ScrollArea className="border rounded-md overflow-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Offer Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {offers.map((offer, index) => (
              <TableRow key={index}>
                <TableCell>{offer.name}</TableCell>
                <TableCell>{offer.code}</TableCell>
                <TableCell>{offer.amount}</TableCell>
                <TableCell
                  className={
                    offer.status === "Expired"
                      ? "text-red-500"
                      : offer.status === "Active"
                      ? "text-green-500"
                      : offer.status === "Scheduled"
                      ? "text-blue-500"
                      : "text-gray-500"
                  }
                >
                  {offer.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span>22 results</span>
        <div className="flex space-x-4">
          <button className="text-gray-500">Prev</button>
          <button className="text-gray-500">Next</button>
        </div>
      </div>
    </div>
  );
}