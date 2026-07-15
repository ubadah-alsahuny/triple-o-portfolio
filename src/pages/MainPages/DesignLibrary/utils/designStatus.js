export const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-gray-500",
    next: ["published"],
    canEdit: true,
    canShare: false,
  },
  published: {
    label: "Published",
    color: "bg-green-500",
    next: ["under_review", "draft"],
    canEdit: true,
    canShare: true,
  },
  under_review: {
    label: "Under Review",
    color: "bg-yellow-500",
    next: [],
    canEdit: false,
    canShare: false,
  },
  approved: {
    label: "Approved",
    color: "bg-blue-500",
    next: [],
    canEdit: true,
    canShare: true,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-600",
    next: ["draft"],
    canEdit: true,
    canShare: false,
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.draft;

export const canTransition = (fromStatus, toStatus) =>
  STATUS_CONFIG[fromStatus]?.next.includes(toStatus) || false;
