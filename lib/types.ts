export interface User {
  id: string;
  name: string;
}

export interface Statement {
  id: string;
  text: string;
  /** Hashtag topics (stored without the # prefix, e.g. "science") */
  tags: string[];
  userId: string;
  createdAt: string;
}

export type Stance = "for" | "against";

export interface Argument {
  id: string;
  statementId: string;
  stance: Stance;
  title: string;
  summary: string;
  userId: string;
  createdAt: string;
}

export type SourceType =
  | "article"
  | "study"
  | "official"
  | "video"
  | "book"
  | "other";

export interface Evidence {
  id: string;
  argumentId: string;
  title: string;
  description: string;
  sourceUrl: string;
  sourceType: SourceType;
  userId: string;
  createdAt: string;
}
