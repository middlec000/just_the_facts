import { render, screen, fireEvent, act } from "@testing-library/react";
import { EditStatementDialog } from "@/components/EditStatementDialog";
import type { Statement } from "@/lib/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("@/lib/actions", () => ({
  editStatement: jest.fn().mockResolvedValue(undefined),
}));

import { editStatement } from "@/lib/actions";

const sampleStatement: Statement = {
  id: "stmt-1",
  text: "Humans have landed on the Moon",
  tags: ["space", "history"],
  upvotes: 14,
  userId: "user-1",
  createdAt: "2025-01-15T10:00:00Z",
};

describe("EditStatementDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the 'Edit' trigger button", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    expect(
      screen.getByRole("button", { name: /^edit$/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    expect(screen.queryByText("Edit Statement")).not.toBeInTheDocument();
  });

  it("opens the dialog when the Edit button is clicked", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    expect(screen.getByText("Edit Statement")).toBeInTheDocument();
  });

  it("pre-fills the statement text field", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const textarea = screen.getByRole("textbox", { name: /statement/i });
    expect(textarea).toHaveValue("Humans have landed on the Moon");
  });

  it("pre-fills the tags field", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const tagsInput = screen.getByRole("textbox", { name: /topics/i });
    expect(tagsInput).toHaveValue("space, history");
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Edit Statement")).not.toBeInTheDocument();
  });

  it("calls editStatement when the form is saved", async () => {
    render(<EditStatementDialog statement={sampleStatement} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    });
    expect(editStatement).toHaveBeenCalledWith("stmt-1", expect.any(FormData));
  });
});
