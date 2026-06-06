import { render, screen } from "@testing-library/react";
import { ArgumentCard } from "@/components/ArgumentCard";
import type { Argument } from "@/lib/types";

// Mock dependencies that use next/navigation or server actions
jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/components/EditArgumentDialog", () => ({
  EditArgumentDialog: () => <button>Edit</button>,
}));

jest.mock("@/lib/actions", () => ({
  castUpvote: jest.fn().mockResolvedValue({ active: true }),
}));

const forArgument: Argument = {
  id: "arg-1",
  statementId: "stmt-1",
  stance: "for",
  title: "Apollo mission records",
  summary: "NASA documented the missions thoroughly.",
  upvotes: 24,
  userId: "user-1",
  createdAt: "2025-01-16T08:00:00Z",
};

const againstArgument: Argument = {
  ...forArgument,
  id: "arg-5",
  stance: "against",
  title: "Photographic anomalies",
  summary: "Critics point to inconsistencies in photos.",
};

describe("ArgumentCard", () => {
  it("renders the argument title", () => {
    render(
      <ArgumentCard argument={forArgument} userName="Dr. Sarah Chen" />,
    );
    expect(screen.getByText("Apollo mission records")).toBeInTheDocument();
  });

  it("renders the argument summary", () => {
    render(
      <ArgumentCard argument={forArgument} userName="Dr. Sarah Chen" />,
    );
    expect(
      screen.getByText("NASA documented the missions thoroughly."),
    ).toBeInTheDocument();
  });

  it("renders the upvote count", () => {
    render(
      <ArgumentCard argument={forArgument} userName="Dr. Sarah Chen" />,
    );
    expect(screen.getByText("24")).toBeInTheDocument();
  });

  it("renders a link to the argument detail page", () => {
    render(
      <ArgumentCard argument={forArgument} userName="Dr. Sarah Chen" />,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/arguments/arg-1");
  });

  it("renders user name in posted-by section", () => {
    render(
      <ArgumentCard argument={forArgument} userName="Dr. Sarah Chen" />,
    );
    expect(screen.getByText("Dr. Sarah Chen")).toBeInTheDocument();
  });

  it("shows Edit button when currentUserId matches argument userId", () => {
    render(
      <ArgumentCard
        argument={forArgument}
        userName="Dr. Sarah Chen"
        currentUserId="user-1"
      />,
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });

  it("does not show Edit button when currentUserId does not match", () => {
    render(
      <ArgumentCard
        argument={forArgument}
        userName="Dr. Sarah Chen"
        currentUserId="user-2"
      />,
    );
    expect(
      screen.queryByRole("button", { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it("renders a 'for' argument card", () => {
    const { container } = render(
      <ArgumentCard argument={forArgument} userName="User" />,
    );
    // The link should have the for-style border class
    const link = container.querySelector("a");
    expect(link?.className).toContain("border-for-border");
  });

  it("renders an 'against' argument card", () => {
    const { container } = render(
      <ArgumentCard argument={againstArgument} userName="User" />,
    );
    const link = container.querySelector("a");
    expect(link?.className).toContain("border-against-border");
  });
});
