import {
  getStatementById,
  getArgumentsByStatementId,
  getArgumentById,
  getEvidenceByArgumentId,
  getStatementForArgument,
  getUserById,
  getAllTags,
  statements,
  arguments_,
  evidence,
  users,
} from "@/lib/mock-data";

describe("getStatementById", () => {
  it("returns the correct statement for a valid id", () => {
    const stmt = getStatementById("stmt-1");
    expect(stmt).toBeDefined();
    expect(stmt?.id).toBe("stmt-1");
    expect(stmt?.text).toBe("Humans have landed on the Moon");
  });

  it("returns undefined for an unknown id", () => {
    expect(getStatementById("nonexistent")).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(getStatementById("")).toBeUndefined();
  });
});

describe("getArgumentsByStatementId", () => {
  it("returns all arguments for a known statement", () => {
    const args = getArgumentsByStatementId("stmt-1");
    expect(args.length).toBeGreaterThan(0);
    args.forEach((a) => expect(a.statementId).toBe("stmt-1"));
  });

  it("returns an empty array for an unknown statement", () => {
    expect(getArgumentsByStatementId("nonexistent")).toEqual([]);
  });

  it("returns both for and against arguments", () => {
    const args = getArgumentsByStatementId("stmt-1");
    const stances = args.map((a) => a.stance);
    expect(stances).toContain("for");
    expect(stances).toContain("against");
  });
});

describe("getArgumentById", () => {
  it("returns the correct argument for a valid id", () => {
    const arg = getArgumentById("arg-1");
    expect(arg).toBeDefined();
    expect(arg?.id).toBe("arg-1");
    expect(arg?.stance).toBe("for");
  });

  it("returns undefined for an unknown id", () => {
    expect(getArgumentById("nonexistent")).toBeUndefined();
  });
});

describe("getEvidenceByArgumentId", () => {
  it("returns all evidence for a known argument", () => {
    const ev = getEvidenceByArgumentId("arg-1");
    expect(ev.length).toBeGreaterThan(0);
    ev.forEach((e) => expect(e.argumentId).toBe("arg-1"));
  });

  it("returns an empty array for an argument with no evidence", () => {
    expect(getEvidenceByArgumentId("nonexistent")).toEqual([]);
  });
});

describe("getStatementForArgument", () => {
  it("returns the parent statement for a valid argument id", () => {
    const stmt = getStatementForArgument("arg-1");
    expect(stmt).toBeDefined();
    expect(stmt?.id).toBe("stmt-1");
  });

  it("returns undefined for an unknown argument id", () => {
    expect(getStatementForArgument("nonexistent")).toBeUndefined();
  });
});

describe("getUserById", () => {
  it("returns the correct user for a valid id", () => {
    const user = getUserById("user-1");
    expect(user).toBeDefined();
    expect(user?.id).toBe("user-1");
    expect(user?.username).toBe("sarah");
  });

  it("returns undefined for an unknown id", () => {
    expect(getUserById("nonexistent")).toBeUndefined();
  });
});

describe("getAllTags", () => {
  it("returns a non-empty sorted array of unique tags", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    // Verify sorted alphabetically
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
  });

  it("returns only unique tags", () => {
    const tags = getAllTags();
    const uniqueTags = Array.from(new Set(tags));
    expect(tags).toEqual(uniqueTags);
  });

  it("includes tags from the statements fixture", () => {
    const tags = getAllTags();
    expect(tags).toContain("space");
    expect(tags).toContain("history");
    expect(tags).toContain("science");
  });
});

describe("data fixtures", () => {
  it("has at least one statement", () => {
    expect(statements.length).toBeGreaterThan(0);
  });

  it("has at least one argument", () => {
    expect(arguments_.length).toBeGreaterThan(0);
  });

  it("has at least one piece of evidence", () => {
    expect(evidence.length).toBeGreaterThan(0);
  });

  it("has at least one user", () => {
    expect(users.length).toBeGreaterThan(0);
  });
});
