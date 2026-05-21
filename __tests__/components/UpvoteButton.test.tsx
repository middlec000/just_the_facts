import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { UpvoteButton } from "@/components/UpvoteButton";

jest.mock("@/lib/actions", () => ({
  castUpvote: jest.fn().mockResolvedValue({ active: true }),
}));

import { castUpvote } from "@/lib/actions";

describe("UpvoteButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the initial upvote count", () => {
    render(
      <UpvoteButton
        id="stmt-1"
        targetType="statement"
        initialUpvotes={14}
        revalidatePath="/"
      />,
    );
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("renders with zero upvotes", () => {
    render(
      <UpvoteButton
        id="stmt-1"
        targetType="statement"
        initialUpvotes={0}
        revalidatePath="/"
      />,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("renders the upvote button with correct aria-label initially", () => {
    render(
      <UpvoteButton
        id="stmt-1"
        targetType="statement"
        initialUpvotes={5}
        revalidatePath="/"
      />,
    );
    expect(screen.getByRole("button", { name: /upvote/i })).toBeInTheDocument();
  });

  it("calls castUpvote when clicked", async () => {
    render(
      <UpvoteButton
        id="stmt-1"
        targetType="statement"
        initialUpvotes={5}
        revalidatePath="/"
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(castUpvote).toHaveBeenCalledWith("statement", "stmt-1", "/");
  });

  it("stops event propagation when stopPropagation is true", async () => {
    const parentClickHandler = jest.fn();
    render(
      <div onClick={parentClickHandler}>
        <UpvoteButton
          id="stmt-1"
          targetType="statement"
          initialUpvotes={5}
          revalidatePath="/"
          stopPropagation
        />
      </div>,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
