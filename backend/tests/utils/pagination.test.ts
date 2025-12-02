/**
 * Unit Tests for Pagination Utilities (Card 14)
 * 
 * Tests the pagination helper functions used across controllers
 */

import {
  parsePaginationParams,
  buildPageInfo,
  buildPaginatedResponse,
  calculateSkip,
  PaginationParams,
  PageInfo,
  PaginatedResponse
} from '../../src/utils/pagination';

describe('Pagination Utilities', () => {
  describe('parsePaginationParams', () => {
    it('should return default values when no query params provided', () => {
      const result = parsePaginationParams({});
      
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.search).toBeUndefined();
    });

    it('should parse valid page and pageSize from query', () => {
      const result = parsePaginationParams({ page: '5', pageSize: '50' });
      
      expect(result.page).toBe(5);
      expect(result.pageSize).toBe(50);
    });

    it('should enforce minimum page of 1', () => {
      const result = parsePaginationParams({ page: '0' });
      expect(result.page).toBe(1);

      const negativeResult = parsePaginationParams({ page: '-5' });
      expect(negativeResult.page).toBe(1);
    });

    it('should default to 20 when pageSize is 0 (falsy)', () => {
      const result = parsePaginationParams({ pageSize: '0' });
      // 0 is falsy, so it defaults to 20, then Math.max(1, 20) = 20
      expect(result.pageSize).toBe(20);

      const negativeResult = parsePaginationParams({ pageSize: '-10' });
      // -10 || 20 = -10 (truthy), Math.max(1, -10) = 1
      expect(negativeResult.pageSize).toBe(1);
    });

    it('should enforce maximum pageSize of 100', () => {
      const result = parsePaginationParams({ pageSize: '200' });
      expect(result.pageSize).toBe(100);

      const largeResult = parsePaginationParams({ pageSize: '1000' });
      expect(largeResult.pageSize).toBe(100);
    });

    it('should parse search parameter', () => {
      const result = parsePaginationParams({ search: 'test query' });
      expect(result.search).toBe('test query');
    });

    it('should trim whitespace from search', () => {
      const result = parsePaginationParams({ search: '  test  ' });
      expect(result.search).toBe('test');
    });

    it('should return undefined for empty search', () => {
      const result = parsePaginationParams({ search: '   ' });
      expect(result.search).toBeUndefined();
    });

    it('should handle non-numeric page gracefully', () => {
      const result = parsePaginationParams({ page: 'abc' });
      expect(result.page).toBe(1);
    });

    it('should handle non-numeric pageSize gracefully', () => {
      const result = parsePaginationParams({ pageSize: 'xyz' });
      expect(result.pageSize).toBe(20);
    });
  });

  describe('buildPageInfo', () => {
    it('should calculate totalPages correctly', () => {
      const result = buildPageInfo(100, 1, 20);
      expect(result.totalPages).toBe(5);
    });

    it('should handle zero total', () => {
      const result = buildPageInfo(0, 1, 20);
      expect(result.totalPages).toBe(0);
      expect(result.hasNext).toBe(false);
      expect(result.hasPrev).toBe(false);
    });

    it('should handle partial last page', () => {
      const result = buildPageInfo(25, 1, 10);
      expect(result.totalPages).toBe(3);
    });

    it('should set hasNext correctly', () => {
      const firstPage = buildPageInfo(50, 1, 10);
      expect(firstPage.hasNext).toBe(true);

      const lastPage = buildPageInfo(50, 5, 10);
      expect(lastPage.hasNext).toBe(false);
    });

    it('should set hasPrev correctly', () => {
      const firstPage = buildPageInfo(50, 1, 10);
      expect(firstPage.hasPrev).toBe(false);

      const secondPage = buildPageInfo(50, 2, 10);
      expect(secondPage.hasPrev).toBe(true);
    });

    it('should include all required properties', () => {
      const result = buildPageInfo(100, 2, 20);
      
      expect(result).toHaveProperty('page', 2);
      expect(result).toHaveProperty('pageSize', 20);
      expect(result).toHaveProperty('total', 100);
      expect(result).toHaveProperty('totalPages', 5);
      expect(result).toHaveProperty('hasNext');
      expect(result).toHaveProperty('hasPrev');
    });
  });

  describe('buildPaginatedResponse', () => {
    it('should construct proper response structure', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = buildPaginatedResponse(data, 100, 1, 20);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pageInfo');
      expect(result).toHaveProperty('filtersApplied');
    });

    it('should include data array', () => {
      const data = [{ id: 1, name: 'Test' }];
      const result = buildPaginatedResponse(data, 1, 1, 10);
      
      expect(result.data).toEqual(data);
    });

    it('should include pageInfo with correct values', () => {
      const result = buildPaginatedResponse([], 50, 3, 10);
      
      expect(result.pageInfo.page).toBe(3);
      expect(result.pageInfo.pageSize).toBe(10);
      expect(result.pageInfo.total).toBe(50);
      expect(result.pageInfo.totalPages).toBe(5);
    });

    it('should include filtersApplied when provided', () => {
      const filters = { status: 'active', search: 'test' };
      const result = buildPaginatedResponse([], 10, 1, 10, filters);
      
      expect(result.filtersApplied).toEqual(filters);
    });

    it('should default to empty filtersApplied object', () => {
      const result = buildPaginatedResponse([], 0, 1, 10);
      expect(result.filtersApplied).toEqual({});
    });
  });

  describe('calculateSkip', () => {
    it('should calculate skip for first page', () => {
      expect(calculateSkip(1, 20)).toBe(0);
    });

    it('should calculate skip for second page', () => {
      expect(calculateSkip(2, 20)).toBe(20);
    });

    it('should calculate skip for arbitrary page', () => {
      expect(calculateSkip(5, 15)).toBe(60);
    });

    it('should handle large page numbers', () => {
      expect(calculateSkip(100, 50)).toBe(4950);
    });
  });
});
