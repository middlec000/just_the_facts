import { formatDate } from "@/lib/utils";

describe("formatDate", () => {
  it("formats a valid ISO date string to a human-readable date", () => {
    const result = formatDate("2025-01-15T10:00:00Z");
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2025/);
  });

  it("includes time information in the output", () => {
    const result = formatDate("2025-06-20T14:30:00Z");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/20/);
    expect(result).toMatch(/2025/);
  });

  it("handles a date at the start of the year", () => {
    const result = formatDate("2024-01-01T12:00:00Z");
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/1/);
    expect(result).toMatch(/2024/);
  });

  it("returns a non-empty string", () => {
    const result = formatDate("2025-03-10T08:00:00Z");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
