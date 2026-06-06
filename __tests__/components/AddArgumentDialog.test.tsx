import { render, screen, fireEvent, act } from "@testing-library/react";
import { AddArgumentDialog } from "@/components/AddArgumentDialog";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/lib/actions", () => ({
  createArgument: jest.fn().mockResolvedValue(undefined),
}));

import { createArgument } from "@/lib/actions";

describe("AddArgumentDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the '+ Add Argument' trigger button", () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    expect(
      screen.getByRole("button", { name: /\+ Add Argument/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    expect(screen.queryByText("Add an Argument")).not.toBeInTheDocument();
  });

  it("opens the dialog when the trigger button is clicked", () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    expect(screen.getByText("Add an Argument")).toBeInTheDocument();
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText("Add an Argument")).not.toBeInTheDocument();
  });

  it("defaults to 'for' stance", () => {
    render(<AddArgumentDialog statementId="stmt-1" defaultStance="for" currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    // 'For' button should be active (has distinct styling)
    const forButton = screen.getByRole("button", { name: /^For$/i });
    expect(forButton).toBeInTheDocument();
  });

  it("defaults to 'against' stance when specified", () => {
    render(
      <AddArgumentDialog statementId="stmt-1" defaultStance="against" currentUserId="user-1" />,
    );
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    const againstButton = screen.getByRole("button", { name: /^Against$/i });
    expect(againstButton).toBeInTheDocument();
  });

  it("renders Title and Summary fields inside the dialog", () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/summary/i)).toBeInTheDocument();
  });

  it("calls createArgument when the form is submitted", async () => {
    render(<AddArgumentDialog statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(screen.getByRole("button", { name: /\+ Add Argument/i }));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test argument title" },
    });
    fireEvent.change(screen.getByLabelText(/summary/i), {
      target: { value: "Test argument summary" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^Add Argument$/i }));
    });
    expect(createArgument).toHaveBeenCalled();
  });
});
