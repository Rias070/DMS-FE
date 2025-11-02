import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import customerService, { Customer } from "../../services/customerService";

export default function CustomerDetails() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await customerService.getById(id as string);
        setCustomer(res.data as Customer);
        setError(null);
      } catch (err) {
        console.error("Error loading customer:", err);
        setError("Không thể tải thông tin khách hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    <>
      <PageMeta title="Customer Details" description="Customer details" />
      <PageBreadcrumb pageTitle="Customer Details" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : !customer ? (
          <div>Không tìm thấy khách hàng.</div>
        ) : (
          <>
            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Customer #{customer.id}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="font-medium">{customer.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{customer.email ?? '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{customer.phone ?? '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div className="font-medium">{customer.address ?? '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Dob</div>
                <div className="font-medium">{customer.dob ? new Date(customer.dob).toLocaleDateString() : '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Created At</div>
                <div className="font-medium">{customer.createdAt ? new Date(customer.createdAt).toLocaleString() : '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Active</div>
                <div className="font-medium">{customer.isActive ? 'Active' : 'Inactive'}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
