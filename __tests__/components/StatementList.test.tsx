import { render, screen, fireEvent } from "@testing-library/react";
import { StatementList } from "@/components/StatementList";
import type { Statement, Review } from "@/lib/types";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: jest.fn(), push: jest.fn() }),
  usePathname: () => "/",
}));

jest.mock("@/lib/actions", () => ({
  castUpvote: jest.fn().mockResolvedValue({ active: true }),
}));

jest.mock("@/components/EditStatementDialog", () => ({
  EditStatementDialog: () => <button>Edit</button>,
}));

type StatementWithCounts = Statement & {
  forCount: number;
  againstCount: number;
  forArgumentUpvotes: number;
  againstArgumentUpvotes: number;
  totalArgumentUpvotes: number;
  latestActivityAt: string;
  userName: string;
  review: Review | null;
};

const baseStatement: StatementWithCounts = {
  id: "stmt-1",
  text: "Humans have landed on the Moon",
  tags: ["space", "history"],
  upvotes: 14,
  userId: "user-1",
  createdAt: "2025-01-15T10:00:00Z",
  forCount: 4,
  againstCount: 3,
  forArgumentUpvotes: 79,
  againstArgumentUpvotes: 16,
  totalArgumentUpvotes: 95,
  latestActivityAt: "2025-01-19T11:00:00Z",
  userName: "Dr. Sarah Chen",
  review: null,
};

const secondStatement: StatementWithCounts = {
  ...baseStatement,
  id: "stmt-2",
  text: "The Earth is round",
  tags: ["science"],
  createdAt: "2025-02-10T10:00:00Z",
  latestActivityAt: "2025-02-10T10:00:00Z",
};

describe("StatementList", () => {
  it("renders statement text", () => {
    render(
      <StatementList
        statements={[baseStatement]}
        allTags={["space", "history"]}
      />,
    );
    expect(
      screen.getByText(/Humans have landed on the Moon/),
    ).toBeInTheDocument();
  });

  it("shows 'No statements found' when list is empty", () => {
    render(<StatementList statements={[]} allTags={[]} />);
    expect(screen.getByText(/No statements found/)).toBeInTheDocument();
  });

  it("renders tag filter chips for allTags", () => {
    render(
      <StatementList
        statements={[baseStatement]}
        allTags={["space", "history"]}
      />,
    );
    // There are multiple elements with tag text (filter chip + statement tag badge)
    const spaceElements = screen.getAllByText(/#space/);
    expect(spaceElements.length).toBeGreaterThanOrEqual(1);
    const historyElements = screen.getAllByText(/#history/);
    expect(historyElements.length).toBeGreaterThanOrEqual(1);
  });

  it("renders the 'All' filter chip", () => {
    render(
      <StatementList statements={[baseStatement]} allTags={["space"]} />,
    );
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
  });

  it("filters statements when a tag chip is clicked", () => {
    render(
      <StatementList
        statements={[baseStatement, secondStatement]}
        allTags={["space", "science"]}
      />,
    );
    // Click the "science" tag chip (the button, not the badge span)
    const scienceButtons = screen.getAllByText(/#science/);
    const chipButton = scienceButtons.find((el) => el.tagName === "BUTTON");
    fireEvent.click(chipButton!);
    // Only the second statement has the "science" tag
    expect(screen.getByText(/The Earth is round/)).toBeInTheDocument();
    expect(
      screen.queryByText(/Humans have landed on the Moon/),
    ).not.toBeInTheDocument();
  });

  it("shows all statements when 'All' is clicked after filtering", () => {
    render(
      <StatementList
        statements={[baseStatement, secondStatement]}
        allTags={["space", "science"]}
      />,
    );
    const scienceButtons = screen.getAllByText(/#science/);
    const chipButton = scienceButtons.find((el) => el.tagName === "BUTTON");
    fireEvent.click(chipButton!);
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText(/Humans have landed on the Moon/)).toBeInTheDocument();
    expect(screen.getByText(/The Earth is round/)).toBeInTheDocument();
  });

  it("shows 'No statements found for #tag' when filter yields nothing", () => {
    render(
      <StatementList
        statements={[baseStatement]}
        allTags={["space", "science"]}
      />,
    );
    fireEvent.click(screen.getByText("#science"));
    expect(screen.getByText(/No statements found for #science/)).toBeInTheDocument();
  });

  it("renders sort buttons", () => {
    render(
      <StatementList statements={[baseStatement]} allTags={[]} />,
    );
    expect(screen.getByText("Date posted")).toBeInTheDocument();
    expect(screen.getByText("Alphabetical")).toBeInTheDocument();
    expect(screen.getByText("Upvotes")).toBeInTheDocument();
  });

  it("renders argument counts", () => {
    render(
      <StatementList
        statements={[baseStatement]}
        allTags={[]}
      />,
    );
    expect(screen.getByText(/4 arguments for/)).toBeInTheDocument();
    expect(screen.getByText(/3 arguments against/)).toBeInTheDocument();
  });

  it("shows Edit button when currentUserId matches statement userId", () => {
    render(
      <StatementList
        statements={[baseStatement]}
        allTags={[]}
        currentUserId="user-1"
      />,
    );
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  });
});
