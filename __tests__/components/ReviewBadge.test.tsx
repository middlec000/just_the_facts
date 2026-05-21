import { render, screen } from "@testing-library/react";
import { ReviewBadge } from "@/components/ReviewBadge";
import type { Review } from "@/lib/types";

const baseReview: Review = {
  id: 1,
  statementId: "stmt-1",
  reviewerId: "user-1",
  reviewerName: "Dr. Sarah Chen",
  status: "verified",
  createdAt: "2025-01-20T10:00:00Z",
};

describe("ReviewBadge", () => {
  it("shows 'Pending Review' when review is null", () => {
    render(<ReviewBadge review={null} />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });

  it("shows 'Verified' badge for a verified review", () => {
    render(<ReviewBadge review={baseReview} />);
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("shows 'Not Objective' badge for a not_objective review", () => {
    render(<ReviewBadge review={{ ...baseReview, status: "not_objective" }} />);
    expect(screen.getByText("Not Objective")).toBeInTheDocument();
  });

  it("shows 'Not Falsifiable' badge for a not_falsifiable review", () => {
    render(
      <ReviewBadge review={{ ...baseReview, status: "not_falsifiable" }} />,
    );
    expect(screen.getByText("Not Falsifiable")).toBeInTheDocument();
  });

  it("shows the reviewer's name", () => {
    render(<ReviewBadge review={baseReview} />);
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("shows '(Updated)' label when updatedAt is present", () => {
    render(
      <ReviewBadge
        review={{ ...baseReview, updatedAt: "2025-02-01T10:00:00Z" }}
      />,
    );
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  it("does not show '(Updated)' when updatedAt is absent", () => {
    render(<ReviewBadge review={baseReview} />);
    expect(screen.queryByText(/Updated/)).not.toBeInTheDocument();
  });
});
