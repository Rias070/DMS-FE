import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const sampleOrders = [
  { id: 101, customer: "John Doe", total: "$89.99", status: "Processing" },
  { id: 102, customer: "Lisa Ray", total: "$129.00", status: "Shipped" },
  { id: 103, customer: "Mike Johnson", total: "$45.50", status: "Delivered" },
];

import { useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState(sampleOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDealCustomer, setNewDealCustomer] = useState("");
  const [newDealTotal, setNewDealTotal] = useState("");
  const [newDealStatus, setNewDealStatus] = useState("New");

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setNewDealCustomer("");
    setNewDealTotal("");
    setNewDealStatus("New");
  }

  function handleCreateDeal() {
    if (!newDealCustomer.trim() || !newDealTotal.trim()) return;
    const newId = Date.now();
    const newDeal = {
      id: newId,
      customer: newDealCustomer.trim(),
      total: newDealTotal.trim(),
      status: newDealStatus,
    };
    setOrders((prev) => [newDeal, ...prev]);
    closeModal();
  }

  return (
    <>
      <PageMeta title="Deals" description="Deals list" />
      <PageBreadcrumb pageTitle="Deals" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="flex items-center justify-between mb-5 lg:mb-7">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Deals</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={openModal}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium"
            >
              Add Deal +
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3">Order ID</th>
                <th className="py-3">Customer</th>
                <th className="py-3">Total</th>
                <th className="py-3">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="text-sm odd:bg-gray-50 dark:odd:bg-white/[0.02]">
                  <td className="py-3">#{o.id}</td>
                  <td className="py-3">{o.customer}</td>
                  <td className="py-3">{o.total}</td>
                  <td className="py-3">{o.status}</td>
                  <td className="py-3">
                    <button className="text-sm text-brand-500">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden
          />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 dark:bg-gray-900">
            <h4 className="text-lg font-semibold mb-4">Create Deal</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Customer</label>
                <input
                  value={newDealCustomer}
                  onChange={(e) => setNewDealCustomer(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Customer name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Total</label>
                <input
                  value={newDealTotal}
                  onChange={(e) => setNewDealTotal(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="$0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select
                  value={newDealStatus}
                  onChange={(e) => setNewDealStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option>New</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-white border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeal}
                className="px-4 py-2 bg-brand-500 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
