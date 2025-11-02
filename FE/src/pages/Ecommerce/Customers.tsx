import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import { customerService, Customer } from "../../services/customerService";
import { useModal } from "../../hooks/useModal";
import CustomerForm from "./CustomerForm";
import { ConfirmDeleteModal } from "../../components/ecommerce/ConfirmDeleteModal";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // modal state
  const { isOpen: isFormOpen, openModal: openForm, closeModal: closeForm } = useModal(false);
  const [editing, setEditing] = useState<Partial<Customer> | null>(null);
  const { isOpen: isDeleteOpen, openModal: openDelete, closeModal: closeDelete } = useModal(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.list();
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setCustomers(data as Customer[]);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Không thể tải dữ liệu khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = () => {
    setEditing(null);
    openForm();
  };

  const handleEdit = (c: Customer) => {
    setEditing(c);
    openForm();
  };

  const handleSave = async (payload: Partial<Customer>) => {
    setSaving(true);
    try {
      if (editing && editing.id) {
        await customerService.update(editing.id, payload);
      } else {
        await customerService.create(payload);
      }
      closeForm();
      await fetchCustomers();
    } catch (err) {
      console.error("Save error:", err);
      // optionally show toast
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    openDelete();
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleting(true);
    try {
      await customerService.remove(deletingId);
      closeDelete();
      setDeletingId(null);
      await fetchCustomers();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Customers" description="Customers" />
      <PageBreadcrumb pageTitle="Customers" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-0">Customers</h3>
          <div>
            <button onClick={handleCreate} className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white">
              Tạo khách hàng
            </button>
          </div>
        </div>

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
                    <td className="py-3">{(c as any).contactPerson ?? "-"}</td>
                    <td className="py-3">{c.email ?? "-"}</td>
                    <td className="py-3">{c.phone ?? "-"}</td>
                    <td className="py-3">{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                    <td className="py-3">{c.isActive ? "Active" : "Inactive"}</td>
                    <td className="py-3">
                      <div className="flex gap-3">
                        <Link className="text-brand-500" to={`/ecommerce/customers/${c.id}`}>
                          View
                        </Link>
                        <button onClick={() => handleEdit(c)} className="text-sm text-gray-600">
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(c.id)} className="text-sm text-red-600">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CustomerForm isOpen={isFormOpen} onClose={closeForm} onSave={handleSave} initial={editing ?? undefined} saving={saving} />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setDeletingId(null);
          closeDelete();
        }}
        onConfirm={handleDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc muốn xóa khách hàng này?"
        loading={deleting}
      />
    </>
  );
}
