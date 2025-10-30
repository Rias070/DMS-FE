import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import { api } from "../../config/api";

type Customer = {
  id: string;
  name: string;
  contactPerson?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: string | null;
  isActive?: boolean | null;
  username?: string | null;
  dealerId?: string | null;
};

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/Customer")
      .then((response) => {
        // response.data có thể là object hoặc array
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setCustomers(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching customer data:", err);
        setError("Không thể tải dữ liệu khách hàng.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta title="Customers" description="Customers" />
      <PageBreadcrumb pageTitle="Customers" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Customers</h3>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : customers.length === 0 ? (
          <div>No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="py-3">Name</th>
                  <th className="py-3">Contact</th>
                  <th className="py-3">Email</th>
                  <th className="py-3">Phone</th>
                  <th className="py-3">Created At</th>
                  <th className="py-3">Active</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id} className="text-sm odd:bg-gray-50 dark:odd:bg-white/[0.02]">
                    <td className="py-3">{c.name}</td>
                    <td className="py-3">{c.contactPerson ?? "-"}</td>
                    <td className="py-3">{c.email ?? "-"}</td>
                    <td className="py-3">{c.phone ?? "-"}</td> 
                    <td className="py-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                    <td className="py-3">{c.isActive ? "Active" : "Inactive"}</td>
                    <td className="py-3">
                      <Link className="text-brand-500" to={`/ecommerce/customers/${c.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
