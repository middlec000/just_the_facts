import { render, screen, fireEvent, act } from "@testing-library/react";
import { AddEvidenceDialog } from "@/components/AddEvidenceDialog";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: refreshMock, push: pushMock }),
  usePathname: () => "/",
}));

jest.mock("@/lib/actions", () => ({
  createEvidence: jest.fn().mockResolvedValue(undefined),
}));

import { createEvidence } from "@/lib/actions";

describe("AddEvidenceDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the '+ Add Evidence' trigger button", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    expect(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    ).toBeInTheDocument();
  });

  it("does not show the dialog initially", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    expect(screen.queryByText("Add Evidence")).not.toBeInTheDocument();
  });

  it("opens the dialog when the trigger button is clicked", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
    expect(screen.getByRole("heading", { name: "Add Evidence" })).toBeInTheDocument();
  });

  it("redirects to login and keeps dialog closed when user is logged out", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
    expect(pushMock).toHaveBeenCalledWith("/login?from=%2F");
    expect(screen.queryByRole("heading", { name: "Add Evidence" })).not.toBeInTheDocument();
  });

  it("closes the dialog when the Cancel button is clicked", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("heading", { name: "Add Evidence" })).not.toBeInTheDocument();
  });

  it("renders Title, Description, and Source type fields inside the dialog", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/source type/i)).toBeInTheDocument();
  });

  it("renders all source type options", () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
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

  it("calls createEvidence when the form is submitted", async () => {
    render(<AddEvidenceDialog argumentId="arg-1" statementId="stmt-1" currentUserId="user-1" />);
    fireEvent.click(
      screen.getByRole("button", { name: /\+ Add Evidence/i }),
    );
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Test evidence title" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Test evidence description" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /^Add Evidence$/i }));
    });
    expect(createEvidence).toHaveBeenCalled();
  });
});
