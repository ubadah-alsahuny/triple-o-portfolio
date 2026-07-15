export const STATUS_INTERNAL_MAP = {
  draft: "draft",
  published: "published",
  under_review: "under review",
  approved: "approved",
  rejected: "rejected",
};

export const REVERSE_STATUS_MAP = Object.entries(STATUS_INTERNAL_MAP).reduce(
  (acc, [key, value]) => {
    acc[value] = key;
    return acc;
  },
  {}
);
