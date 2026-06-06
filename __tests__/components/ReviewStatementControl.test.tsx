import { render, screen, fireEvent, act } from "@testing-library/react";
import { ReviewStatementControl } from "@/components/ReviewStatementControl";
import type { Review } from "@/lib/types";

jest.mock("@/lib/actions", () => ({
  reviewStatement: jest.fn().mockResolvedValue(undefined),
}));

import { reviewStatement } from "@/lib/actions";

describe("ReviewStatementControl", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows 'Review this statement:' when there is no existing review", () => {
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={null} />,
    );
    expect(screen.getByText(/Review this statement:/)).toBeInTheDocument();
  });

  it("shows 'Update your review:' when there is an existing review", () => {
    const review: Review = {
      id: 1,
      statementId: "stmt-1",
      reviewerId: "user-1",
      reviewerName: "Dr. Sarah Chen",
      status: "verified",
      createdAt: "2025-01-20T10:00:00Z",
    };
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={review} />,
    );
    expect(screen.getByText(/Update your review:/)).toBeInTheDocument();
  });

  it("renders the submit button with 'Submit' text when no existing review", () => {
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={null} />,
    );
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders the submit button with 'Update' text when there is an existing review", () => {
    const review: Review = {
      id: 1,
      statementId: "stmt-1",
      reviewerId: "user-1",
      reviewerName: "Reviewer",
      status: "verified",
      createdAt: "2025-01-20T10:00:00Z",
    };
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={review} />,
    );
    expect(screen.getByRole("button", { name: /update/i })).toBeInTheDocument();
  });

  it("calls reviewStatement on form submit", async () => {
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={null} />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    });
    expect(reviewStatement).toHaveBeenCalledWith("stmt-1", "verified");
  });

  it("renders all three review status options", () => {
    render(
      <ReviewStatementControl statementId="stmt-1" existingReview={null} />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => o.value);
    expect(values).toContain("verified");
    expect(values).toContain("not_objective");
    expect(values).toContain("not_falsifiable");
  });
});
