import { render, screen, fireEvent, act } from "@testing-library/react";
import { AddStatementDialog } from "@/components/AddStatementDialog";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/lib/actions", () => ({
  createStatement: jest.fn().mockResolvedValue(undefined),
}));

import { createStatement } from "@/lib/actions";

describe("AddStatementDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the '+ Add Statement' trigger button", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    expect(
      screen.getByRole("button", { name: /\+ Add Statement/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    expect(screen.queryByText("Add a Statement")).not.toBeInTheDocument();
  });

  it("opens the dialog when the trigger button is clicked", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Statement/i }));
    expect(screen.getByText("Add a Statement")).toBeInTheDocument();
  });

  it("closes the dialog when the close button is clicked", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Statement/i }));
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText("Add a Statement")).not.toBeInTheDocument();
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Statement/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Add a Statement")).not.toBeInTheDocument();
  });

  it("renders Statement and Topics fields inside the dialog", () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Statement/i }));
    expect(screen.getByLabelText(/statement/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/topics/i)).toBeInTheDocument();
  });

  it("calls createStatement when the form is submitted", async () => {
    render(<AddStatementDialog currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Statement/i }));
    fireEvent.change(screen.getByLabelText(/statement/i), {
      target: { value: "Test statement text" },
    });
    // Get the submit button (type="submit") inside the dialog
    const submitBtn = screen.getByRole("button", { name: /^Add Statement$/i });
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(createStatement).toHaveBeenCalled();
  });
});
