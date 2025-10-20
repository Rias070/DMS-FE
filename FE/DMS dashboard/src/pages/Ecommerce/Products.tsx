import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const sampleProducts = [
  { id: 1, name: "Basic Tee", sku: "BT-001", price: "$19.99", stock: 120 },
  { id: 2, name: "Sport Shoes", sku: "SS-102", price: "$69.00", stock: 34 },
  { id: 3, name: "Leather Bag", sku: "LB-210", price: "$129.00", stock: 12 },
];

export default function Products() {
  return (
    <>
      <PageMeta title="Products" description="Product list" />
      <PageBreadcrumb pageTitle="Products" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Products</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead>
              <tr className="text-sm text-gray-500 border-b">
                <th className="py-3">Name</th>
                <th className="py-3">SKU</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sampleProducts.map((p) => (
                <tr key={p.id} className="text-sm odd:bg-gray-50 dark:odd:bg-white/[0.02]">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{p.sku}</td>
                  <td className="py-3">{p.price}</td>
                  <td className="py-3">{p.stock}</td>
                  <td className="py-3">
                    <button className="text-sm text-brand-500">View</button>
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
