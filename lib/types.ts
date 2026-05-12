export interface User {
  id: string;
  name: string;
  username: string;
}

export interface Statement {
  id: string;
  text: string;
  /** Hashtag topics (stored without the # prefix, e.g. "science") */
  tags: string[];
  upvotes: number;
  userId: string;
  createdAt: string;
  updatedAt?: string;
}

export type Stance = "for" | "against";

export interface Argument {
  id: string;
  statementId: string;
  stance: Stance;
  title: string;
  summary: string;
  upvotes: number;
  userId: string;
  createdAt: string;
  updatedAt?: string;
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
  updatedAt?: string;
}

export type ReviewStatus = "verified" | "not_objective" | "not_falsifiable";

export interface Review {
  id: number;
  statementId: string;
  reviewerId: string;
  reviewerName: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt?: string;
}
