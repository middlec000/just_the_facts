import { render, screen } from "@testing-library/react";
import { PostedBy } from "@/components/PostedBy";

describe("PostedBy", () => {
  it("renders the user name", () => {
    render(
      <PostedBy userName="Dr. Sarah Chen" createdAt="2025-01-15T10:00:00Z" />,
    );
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("renders the formatted creation date when no updatedAt", () => {
    render(
      <PostedBy userName="Alice" createdAt="2025-01-15T10:00:00Z" />,
    );
    // Date should appear somewhere in the component
    expect(screen.getByText(/Jan/)).toBeInTheDocument();
    expect(screen.getByText(/2025/)).toBeInTheDocument();
  });

  it("shows '(Edited)' label when updatedAt is provided", () => {
    render(
      <PostedBy
        userName="Alice"
        createdAt="2025-01-15T10:00:00Z"
        updatedAt="2025-02-01T09:00:00Z"
      />,
    );
    expect(screen.getByText(/Edited/)).toBeInTheDocument();
  });

  it("does not show '(Edited)' when updatedAt is absent", () => {
    render(
      <PostedBy userName="Alice" createdAt="2025-01-15T10:00:00Z" />,
    );
    expect(screen.queryByText(/Edited/)).not.toBeInTheDocument();
  });

  it("uses the updatedAt date when provided", () => {
    render(
      <PostedBy
        userName="Alice"
        createdAt="2025-01-15T10:00:00Z"
        updatedAt="2025-03-10T09:00:00Z"
      />,
    );
    expect(screen.getByText(/Mar/)).toBeInTheDocument();
  });
});
