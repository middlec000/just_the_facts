import { render, screen, fireEvent, act } from "@testing-library/react";
import { EditArgumentDialog } from "@/components/EditArgumentDialog";
import type { Argument } from "@/lib/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn() }),
}));

jest.mock("@/lib/actions", () => ({
  editArgument: jest.fn().mockResolvedValue(undefined),
}));

import { editArgument } from "@/lib/actions";

const sampleArgument: Argument = {
  id: "arg-1",
  statementId: "stmt-1",
  stance: "for",
  title: "Apollo mission records",
  summary: "NASA documented the missions thoroughly.",
  upvotes: 24,
  userId: "user-1",
  createdAt: "2025-01-16T08:00:00Z",
};

describe("EditArgumentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the 'Edit' trigger button", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    expect(
      screen.getByRole("button", { name: /^edit$/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    expect(screen.queryByText("Edit Argument")).not.toBeInTheDocument();
  });

  it("opens the dialog when the Edit button is clicked", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    expect(screen.getByText("Edit Argument")).toBeInTheDocument();
  });

  it("pre-fills the title field", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const titleInput = screen.getByRole("textbox", { name: /title/i });
    expect(titleInput).toHaveValue("Apollo mission records");
  });

  it("pre-fills the summary field", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    const summaryTextarea = screen.getByRole("textbox", { name: /summary/i });
    expect(summaryTextarea).toHaveValue(
      "NASA documented the missions thoroughly.",
    );
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Edit Argument")).not.toBeInTheDocument();
  });

  it("calls editArgument when the form is saved", async () => {
    render(<EditArgumentDialog argument={sampleArgument} />);
    fireEvent.click(screen.getByRole("button", { name: /^edit$/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /save changes/i }));
    });
    expect(editArgument).toHaveBeenCalledWith(
      "arg-1",
      expect.any(FormData),
    );
  });
});
