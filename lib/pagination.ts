/**
 * Parse pagination parameters from URL search params.
 * Returns page (1-indexed), pageSize (clamped 1-100), skip, and take for Prisma.
 */
export function parsePagination(params: URLSearchParams, defaultPageSize = 20) {
  const page = Math.max(1, parseInt(params.get("page") || "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(params.get("pageSize") || String(defaultPageSize), 10)));
  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

/**
 * Build a standardized paginated response envelope.
 */
export function paginatedResponse<T>(data: T[], total: number, page: number, pageSize: number) {
  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
