export type StatementType = 'Quote' | 'Argument' | 'Learn';

export interface Statement {
  id: string;
  text: string;
  type: StatementType;
  userId: string;
  timestamp: string;
  supportingEvidenceCount: number;
  refutingEvidenceCount: number;
}

export type EvidenceType = 'Illustrative' | 'Documentation' | 'Testimonial';
export type EvidenceStance = 'supporting' | 'refuting';

export interface Evidence {
  id: string;
  statementId: string;
  title: string;
  stance: EvidenceStance;
  link?: string;
  type: EvidenceType;
  description: string;
  userId: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
}
