'use server';

import { 
  createStatement as createStatementInStorage, 
  createEvidence as createEvidenceInStorage,
  getAllStatements as getAllStatementsFromStorage,
  getStatementById as getStatementByIdFromStorage,
  getEvidenceByStatementId as getEvidenceByStatementIdFromStorage
} from './storage';

import { Statement, Evidence, StatementType, EvidenceType, EvidenceStance } from '../types';

// Default user for now since we don't have authentication
const DEFAULT_USER_ID = 'user-1';
const DEFAULT_USER_NAME = 'Anonymous';

export async function getAllStatements(sortOrder: 'most' | 'least' = 'most'): Promise<Statement[]> {
  const statements = getAllStatementsFromStorage();
  
  return statements.sort((a, b) => {
    const totalA = a.supportingEvidenceCount + a.refutingEvidenceCount;
    const totalB = b.supportingEvidenceCount + b.refutingEvidenceCount;
    
    if (sortOrder === 'most') {
      return totalB - totalA;
    } else {
      return totalA - totalB;
    }
  });
}

export async function getStatementById(id: string): Promise<Statement | undefined> {
  return getStatementByIdFromStorage(id);
}

export async function getEvidenceByStatementId(statementId: string): Promise<{
  supporting: Evidence[];
  refuting: Evidence[];
}> {
  const evidence = getEvidenceByStatementIdFromStorage(statementId);
  
  const supporting = evidence.filter(e => e.stance === 'supporting');
  const refuting = evidence.filter(e => e.stance === 'refuting');
  
  return { supporting, refuting };
}

export async function createStatement(
  text: string,
  type: StatementType
): Promise<Statement> {
  // Validation
  if (!text.trim()) {
    throw new Error('Statement text is required');
  }
  
  return createStatementInStorage({
    text,
    type,
    userId: DEFAULT_USER_ID,
  });
}

export async function createEvidence(
  statementId: string,
  title: string,
  stance: EvidenceStance,
  type: EvidenceType,
  description: string,
  link?: string
): Promise<Evidence> {
  // Validation
  if (!title.trim()) {
    throw new Error('Evidence title is required');
  }
  
  if (!description.trim()) {
    throw new Error('Evidence description is required');
  }
  
  if (!statementId) {
    throw new Error('Statement ID is required');
  }
  
  return createEvidenceInStorage({
    statementId,
    title,
    stance,
    type,
    description,
    link,
    userId: DEFAULT_USER_ID,
  });
}
