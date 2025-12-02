// =============================================================================
// Card 23 - Shared Pagination Utilities
// =============================================================================

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pageInfo: PageInfo;
  filtersApplied: Record<string, any>;
}

/**
 * Parse pagination parameters from request query
 */
export function parsePaginationParams(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 20));
  const search = query.search?.trim() || undefined;
  return { page, pageSize, search };
}

/**
 * Build page info object for response
 */
export function buildPageInfo(total: number, page: number, pageSize: number): PageInfo {
  const totalPages = Math.ceil(total / pageSize);
  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

/**
 * Build paginated response object
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  filtersApplied: Record<string, any> = {}
): PaginatedResponse<T> {
  return {
    data,
    pageInfo: buildPageInfo(total, page, pageSize),
    filtersApplied
  };
}

/**
 * Calculate skip value for Prisma queries
 */
export function calculateSkip(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}
