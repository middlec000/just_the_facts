import { render, screen, fireEvent, act } from "@testing-library/react";
import { EditEvidenceDialog } from "@/components/EditEvidenceDialog";
import type { Evidence } from "@/lib/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("@/lib/actions", () => ({
  editEvidence: jest.fn().mockResolvedValue(undefined),
}));

import { editEvidence } from "@/lib/actions";

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

describe("EditEvidenceDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the 'Edit' trigger button", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    expect(
      screen.getByRole("button", { name: /^edit$/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    expect(screen.queryByText("Edit Evidence")).not.toBeInTheDocument();
  });

  it("opens the dialog when the Edit button is clicked", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    expect(screen.getByText("Edit Evidence")).toBeInTheDocument();
  });

  it("pre-fills the title field", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    expect(titleInput).toHaveValue("NASA Apollo 11 Mission Report");
  });

  it("pre-fills the description field", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const descTextarea = screen.getByRole("textbox", { name: /description/i });
    expect(descTextarea).toHaveValue(
      "The complete official mission report for Apollo 11.",
    );
  });

  it("renders all source type options", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.value,
    );
    expect(options).toContain("article");
    expect(options).toContain("study");
    expect(options).toContain("official");
    expect(options).toContain("video");
    expect(options).toContain("book");
    expect(options).toContain("other");
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Edit Evidence")).not.toBeInTheDocument();
  });

  it("calls editEvidence when the form is saved", async () => {
    render(<EditEvidenceDialog evidence={sampleEvidence} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    });
    expect(editEvidence).toHaveBeenCalledWith("ev-1", expect.any(FormData));
  });
});
