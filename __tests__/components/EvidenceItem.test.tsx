import { render, screen } from "@testing-library/react";
import { EvidenceItem } from "@/components/EvidenceItem";
import type { Evidence } from "@/lib/types";

// Mock the EditEvidenceDialog since it uses server actions
jest.mock("@/components/EditEvidenceDialog", () => ({
  EditEvidenceDialog: () => <button>Edit</button>,
}));

const sampleEvidence: Evidence = {
  id: "ev-1",
  argumentId: "arg-1",
  title: "NASA Apollo 11 Mission Report",
  description: "The complete official mission report for Apollo 11.",
  sourceUrl: "https://www.nasa.gov/mission/apollo-11/",
  sourceType: "official",
  userId: "user-1",
  createdAt: "2025-01-18T08:00:00Z",
};

describe("EvidenceItem", () => {
  it("renders the evidence title", () => {
    render(
      <EvidenceItem
        evidence={sampleEvidence}
        userName="Dr. Sarah Chen"
      />,
    );
    expect(
      screen.getByText("NASA Apollo 11 Mission Report"),
    ).toBeInTheDocument();
  });

  it("renders the evidence description", () => {
    render(
      <EvidenceItem evidence={sampleEvidence} userName="Dr. Sarah Chen" />,
    );
    expect(
      screen.getByText("The complete official mission report for Apollo 11."),
    ).toBeInTheDocument();
  });

  it("renders the source type label", () => {
    render(
      <EvidenceItem evidence={sampleEvidence} userName="Dr. Sarah Chen" />,
    );
    expect(screen.getByText("Official Source")).toBeInTheDocument();
  });

  it("renders the source URL link", () => {
    render(
      <EvidenceItem evidence={sampleEvidence} userName="Dr. Sarah Chen" />,
    );
    const link = screen.getByRole("link", { name: /view source/i });
    expect(link).toHaveAttribute(
      "href",
      "https://www.nasa.gov/mission/apollo-11/",
    );
  });

  it("renders the posted-by section with user name", () => {
    render(
      <EvidenceItem evidence={sampleEvidence} userName="Dr. Sarah Chen" />,
    );
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("shows Edit button when currentUserId matches evidence userId", () => {
    render(
      <EvidenceItem
        evidence={sampleEvidence}
        userName="Dr. Sarah Chen"
        currentUserId="user-1"
      />,
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("does not show Edit button when currentUserId does not match", () => {
    render(
      <EvidenceItem
        evidence={sampleEvidence}
        userName="Dr. Sarah Chen"
        currentUserId="user-2"
      />,
    );
    expect(
      screen.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it("does not show Edit button when currentUserId is absent", () => {
    render(
      <EvidenceItem evidence={sampleEvidence} userName="Dr. Sarah Chen" />,
    );
    expect(
      screen.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it("renders all source type labels correctly", () => {
    const sourceTypes = [
      { type: "article" as const, label: "Article" },
      { type: "study" as const, label: "Study" },
      { type: "video" as const, label: "Video" },
      { type: "book" as const, label: "Book" },
      { type: "other" as const, label: "Other" },
    ];

    for (const { type, label } of sourceTypes) {
      const { unmount } = render(
        <EvidenceItem
          evidence={{ ...sampleEvidence, sourceType: type }}
          userName="User"
        />,
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });
});
