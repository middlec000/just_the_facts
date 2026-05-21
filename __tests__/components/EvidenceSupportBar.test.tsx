import { render, screen } from "@testing-library/react";
import { EvidenceSupportBar } from "@/components/EvidenceSupportBar";

describe("EvidenceSupportBar", () => {
  it("shows 'No upvotes yet' when both counts are zero", () => {
    render(
      <EvidenceSupportBar forArgumentUpvotes={0} againstArgumentUpvotes={0} />,
    );
    expect(screen.getByText("No upvotes yet")).toBeInTheDocument();
  });

  it("shows for and against upvote counts when non-zero", () => {
    render(
      <EvidenceSupportBar
        forArgumentUpvotes={10}
        againstArgumentUpvotes={5}
      />,
    );
    expect(screen.getByText(/for \(10 upvotes\)/)).toBeInTheDocument();
    expect(screen.getByText(/against \(5 upvotes\)/)).toBeInTheDocument();
  });

  it("does not show 'against' text when both counts are zero", () => {
    render(
      <EvidenceSupportBar forArgumentUpvotes={0} againstArgumentUpvotes={0} />,
    );
    expect(screen.queryByText(/against/)).not.toBeInTheDocument();
  });

  it("calculates the for percentage correctly (50-50 split)", () => {
    const { container } = render(
      <EvidenceSupportBar forArgumentUpvotes={5} againstArgumentUpvotes={5} />,
    );
    // The first coloured div should be 50%
    const bars = container.querySelectorAll(".bg-emerald-500, .bg-rose-400");
    expect(bars[0]).toHaveStyle({ width: "50%" });
    expect(bars[1]).toHaveStyle({ width: "50%" });
  });

  it("renders the bar container", () => {
    const { container } = render(
      <EvidenceSupportBar forArgumentUpvotes={3} againstArgumentUpvotes={1} />,
    );
    expect(container.querySelector(".h-2")).toBeInTheDocument();
  });
});
