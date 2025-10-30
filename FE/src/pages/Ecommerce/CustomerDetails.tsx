import { useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function CustomerDetails() {
  const { id } = useParams();

  return (
    <>
      <PageMeta title="Customer Details" description="Customer details" />
      <PageBreadcrumb pageTitle="Customer Details" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Customer #{id}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">This is a placeholder for customer details (id: {id}).</p>
      </div>
    </>
  );
}
