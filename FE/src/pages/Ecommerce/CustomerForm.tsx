import React, { useEffect, useState } from "react";
import { Modal } from "../../components/ui/modal";
import { Customer as CustomerType } from "../../services/customerService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Partial<CustomerType>) => Promise<void> | void;
  initial?: Partial<CustomerType> | null;
  saving?: boolean;
}

export const CustomerForm: React.FC<Props> = ({ isOpen, onClose, onSave, initial = null, saving = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState<string | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (initial) {
      setName(initial.name ?? "");
      setEmail(initial.email ?? "");
      setPhone(initial.phone ?? "");
      setAddress(initial.address ?? "");
      setDob(initial.dob ? initial.dob.split("T")[0] : undefined);
      setIsActive(initial.isActive ?? true);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setDob(undefined);
      setIsActive(true);
    }
  }, [initial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<CustomerType> = {
      name,
      email: email || null,
      phone: phone || null,
      address: address || null,
      dob: dob ? new Date(dob).toISOString() : null,
      isActive,
    };

    await onSave(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl mx-4">
      <div className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
          {initial?.id ? "Sửa khách hàng" : "Tạo khách hàng"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-gray-600">Tên</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>

            <div>
              <label className="block text-sm text-gray-600">DOB</label>
              <input type="date" value={dob ?? ""} onChange={(e) => setDob(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-600">Address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
            </div>

            <div className="flex items-center gap-2">
              <input id="active" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              <label htmlFor="active" className="text-sm text-gray-600">Active</label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2 text-sm">Hủy</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-brand-500 px-4 py-2 text-sm text-white disabled:opacity-70">
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CustomerForm;
