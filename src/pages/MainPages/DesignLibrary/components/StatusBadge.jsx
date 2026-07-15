import { getStatusConfig } from "../utils/designStatus";
import { REVERSE_STATUS_MAP } from "../utils/statusMap";

const StatusBadge = ({ status }) => {
  const internalStatus = REVERSE_STATUS_MAP[status] || "draft";
  const config = getStatusConfig(internalStatus);

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} text-white`}
      title={`Design status : ${config.label}`}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
