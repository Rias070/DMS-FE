import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const sampleCustomers = [
  { id: 1, name: "John Doe", email: "john@example.com", orders: 4 },
  { id: 2, name: "Lisa Ray", email: "lisa@example.com", orders: 10 },
  { id: 3, name: "Mike Johnson", email: "mike@example.com", orders: 2 },
];

export default function Customers() {
  return (
    <>
      <PageMeta title="Customers" description="Customers" />
      <PageBreadcrumb pageTitle="Customers" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Customers</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Orders</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleCustomers.map((c) => (
                <tr key={c.id} className="text-sm odd:bg-gray-50 dark:odd:bg-white/[0.02]">
                  <td className="py-3">{c.name}</td>
                  <td className="py-3">{c.email}</td>
                  <td className="py-3">{c.orders}</td>
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
      </div>
    </>
  );
}
