import { describe, it, expect } from "vitest";
import { parsePagination, paginatedResponse } from "@/lib/pagination";

describe("parsePagination", () => {
  it("should return default values when no params provided", () => {
    const params = new URLSearchParams();
    const result = parsePagination(params);

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.skip).toBe(0);
    expect(result.take).toBe(20);
  });

  it("should parse custom page and pageSize", () => {
    const params = new URLSearchParams({ page: "3", pageSize: "10" });
    const result = parsePagination(params);

    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.skip).toBe(20); // (3-1) * 10
    expect(result.take).toBe(10);
  });

  it("should use a custom default pageSize", () => {
    const params = new URLSearchParams();
    const result = parsePagination(params, 50);

    expect(result.pageSize).toBe(50);
    expect(result.take).toBe(50);
  });

  it("should clamp page to minimum 1", () => {
    const params = new URLSearchParams({ page: "0" });
    const result = parsePagination(params);

    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it("should clamp negative page to 1", () => {
    const params = new URLSearchParams({ page: "-5" });
    const result = parsePagination(params);

    expect(result.page).toBe(1);
    expect(result.skip).toBe(0);
  });

  it("should clamp pageSize to minimum 1", () => {
    const params = new URLSearchParams({ pageSize: "0" });
    const result = parsePagination(params);

    expect(result.pageSize).toBe(1);
    expect(result.take).toBe(1);
  });

  it("should clamp negative pageSize to 1", () => {
    const params = new URLSearchParams({ pageSize: "-10" });
    const result = parsePagination(params);

    expect(result.pageSize).toBe(1);
    expect(result.take).toBe(1);
  });

  it("should clamp pageSize to maximum 100", () => {
    const params = new URLSearchParams({ pageSize: "500" });
    const result = parsePagination(params);

    expect(result.pageSize).toBe(100);
    expect(result.take).toBe(100);
  });

  it("should accept pageSize exactly 100", () => {
    const params = new URLSearchParams({ pageSize: "100" });
    const result = parsePagination(params);

    expect(result.pageSize).toBe(100);
  });

  it("should accept pageSize exactly 1", () => {
    const params = new URLSearchParams({ pageSize: "1" });
    const result = parsePagination(params);

    expect(result.pageSize).toBe(1);
  });

  it("should calculate skip correctly for page 2, pageSize 25", () => {
    const params = new URLSearchParams({ page: "2", pageSize: "25" });
    const result = parsePagination(params);

    expect(result.skip).toBe(25); // (2-1) * 25
    expect(result.take).toBe(25);
  });

  it("should propagate NaN when page is non-numeric", () => {
    const params = new URLSearchParams({ page: "abc" });
    const result = parsePagination(params);

    // parseInt("abc") = NaN, Math.max(1, NaN) = NaN
    expect(result.page).toBeNaN();
  });

  it("should propagate NaN when pageSize is non-numeric", () => {
    const params = new URLSearchParams({ pageSize: "xyz" });
    const result = parsePagination(params);

    // parseInt("xyz") = NaN, Math.min/Math.max with NaN = NaN
    expect(result.pageSize).toBeNaN();
  });
});

describe("paginatedResponse", () => {
  it("should return a correct response envelope", () => {
    const data = [{ id: "1" }, { id: "2" }];
    const result = paginatedResponse(data, 50, 1, 20);

    expect(result.data).toBe(data);
    expect(result.meta.total).toBe(50);
    expect(result.meta.page).toBe(1);
    expect(result.meta.pageSize).toBe(20);
    expect(result.meta.totalPages).toBe(3); // ceil(50/20)
  });

  it("should calculate totalPages correctly for exact division", () => {
    const result = paginatedResponse([], 100, 1, 20);
    expect(result.meta.totalPages).toBe(5); // 100 / 20
  });

  it("should calculate totalPages correctly with remainder", () => {
    const result = paginatedResponse([], 101, 1, 20);
    expect(result.meta.totalPages).toBe(6); // ceil(101/20)
  });

  it("should return totalPages 0 when total is 0", () => {
    const result = paginatedResponse([], 0, 1, 20);
    expect(result.meta.totalPages).toBe(0);
  });

  it("should return totalPages 1 when total equals pageSize", () => {
    const result = paginatedResponse([], 20, 1, 20);
    expect(result.meta.totalPages).toBe(1);
  });

  it("should return totalPages 1 when total is less than pageSize", () => {
    const result = paginatedResponse([], 5, 1, 20);
    expect(result.meta.totalPages).toBe(1); // ceil(5/20)
  });

  it("should preserve the data array as-is", () => {
    const items = [
      { id: "a", name: "Alpha" },
      { id: "b", name: "Bravo" },
    ];
    const result = paginatedResponse(items, 2, 1, 10);

    expect(result.data).toHaveLength(2);
    expect(result.data[0]).toEqual({ id: "a", name: "Alpha" });
    expect(result.data[1]).toEqual({ id: "b", name: "Bravo" });
  });

  it("should handle empty data array", () => {
    const result = paginatedResponse([], 0, 1, 20);

    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
  });

  it("should pass through page and pageSize values unchanged", () => {
    const result = paginatedResponse([], 200, 5, 50);

    expect(result.meta.page).toBe(5);
    expect(result.meta.pageSize).toBe(50);
    expect(result.meta.totalPages).toBe(4); // ceil(200/50)
  });
});
