import { render, screen, fireEvent } from "@testing-library/react";
import { DialogShell } from "@/components/DialogShell";

describe("DialogShell", () => {
  it("renders the title", () => {
    render(
      <DialogShell title="Test Dialog" onClose={jest.fn()}>
        <p>Dialog content</p>
      </DialogShell>,
    );
    expect(screen.getByText("Test Dialog")).toBeInTheDocument();
  });

  it("renders child content", () => {
    render(
      <DialogShell title="My Dialog" onClose={jest.fn()}>
        <p>Hello from inside</p>
      </DialogShell>,
    );
    expect(screen.getByText("Hello from inside")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();
    render(
      <DialogShell title="Dialog" onClose={onClose}>
        <p>content</p>
      </DialogShell>,
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = jest.fn();
    render(
      <DialogShell title="Dialog" onClose={onClose}>
        <p>content</p>
      </DialogShell>,
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = jest.fn();
    const { container } = render(
      <DialogShell title="Dialog" onClose={onClose}>
        <p>content</p>
      </DialogShell>,
    );
    // The outer backdrop div is the first child of the container
    const backdrop = container.firstChild as HTMLElement;
    fireEvent.mouseDown(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
