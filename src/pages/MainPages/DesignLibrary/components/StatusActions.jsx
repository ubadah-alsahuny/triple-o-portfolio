import { getStatusConfig } from "../utils/designStatus";

export default function StatusActions({ design, onChangeStatus, isLoading }) {
  const config = getStatusConfig(design.status);

  if (!config.next.length || design.status === "under review") return null;

  const handleChange = (newStatus) => {
    const label = getStatusConfig(newStatus).label;
    if (
      window.confirm(`Do you want to change the design status to "${label}"؟`)
    ) {
      onChangeStatus(newStatus);
    }
  };

  return (
    <div className="flex flex-col">
      {config.next.map((status) => {
        // فلترة إضافية للتحويلات غير المسموحة
        if (status === "under review" && design.status !== "published")
          return null;
        if (status === "published" && design.status === "approved") return null;

        return (
          <button
            key={status}
            onClick={() => handleChange(status)}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 mb-2 text-gray-800 rounded text-sm disabled:opacity-50"
          >
            {getStatusConfig(status).label}
          </button>
        );
      })}
    </div>
  );
}
