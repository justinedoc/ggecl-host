import { useEffect, useState, useCallback, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdmins } from "../hooks/useAdmins";
import { useEnrollAdmin } from "../hooks/useEnrollAdmin";

// ---------------- Validation Schema ----------------
const AdminRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  picture: z.string().url("Invalid URL format").optional().or(z.literal("")), // allow empty
});

type AdminFormValues = z.infer<typeof AdminRegistrationSchema>;

// ---------------- AdminForm Component ----------------
const AdminForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(AdminRegistrationSchema),
  });

  const { enrollAdmin } = useEnrollAdmin();

  const onSubmit = async (data: AdminFormValues) => {
    enrollAdmin(data, {
      onSuccess: () => {
        setTimeout(() => {
          reset();
        }, 2000);
      },
    });
  };

  return (
    <div className="rounded-lg border p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
        Add New Admin
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            className="w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-md border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-fit px-6 rounded-md bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50 md:col-span-3"
        >
          {isSubmitting ? "Enrolling..." : "Add Admin"}
        </button>
      </form>
    </div>
  );
};

const AdminList: React.FC = () => {
  const { admins, loadingAdmins } = useAdmins({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredAdmins = useMemo(
    () =>
      admins.filter((a) =>
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [admins, searchTerm],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAdmins.length / rowsPerPage),
  );

  const paginated = useMemo(
    () =>
      filteredAdmins.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      ),
    [filteredAdmins, currentPage, rowsPerPage],
  );

  const changePage = useCallback(
    (dir: "prev" | "next") => {
      setCurrentPage((p) =>
        dir === "prev" ? Math.max(1, p - 1) : Math.min(totalPages, p + 1),
      );
    },
    [totalPages],
  );

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
        Admins
      </h2>

      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs rounded-md border px-4 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Rows per page:
          </span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(+e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md border px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg shadow-md dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold dark:text-gray-300">
                <input type="checkbox" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold dark:text-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold dark:text-gray-300">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {loadingAdmins ? (
              <tr>
                <td colSpan={4} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : paginated.length ? (
              paginated.map((admin) => (
                <tr
                  key={admin.email}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" />
                  </td>
                  <td className="px-4 py-3 text-sm dark:text-gray-200">
                    {admin.fullName}
                  </td>
                  <td className="px-4 py-3 text-sm dark:text-gray-200">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3 text-right text-sm dark:text-gray-400">
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="py-10 text-center text-gray-500 italic"
                >
                  No admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => changePage("prev")}
            disabled={currentPage === 1}
            className="rounded p-2 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => changePage("next")}
            disabled={currentPage === totalPages}
            className="rounded p-2 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminInfo: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
    <AdminForm />
    <AdminList />
  </div>
);

export default AdminInfo;
