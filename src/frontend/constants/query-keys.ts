export const queryKeys = {
  currentUser: ["current-user"] as const,

  documents: {
    my: ["documents", "my"] as const,
    submitted: ["documents", "submitted"] as const,
    published: ["documents", "published"] as const,
    approved: ["documents", "approved"] as const,
    detail: (id: string) => ["documents", id] as const,
  },
};