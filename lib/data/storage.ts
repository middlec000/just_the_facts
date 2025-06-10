import fs from 'fs';
import path from 'path';
import { Statement, Evidence } from '../types';

// Define data file paths
const DATA_DIR = path.join(process.cwd(), 'data');
const STATEMENTS_FILE = path.join(DATA_DIR, 'statements.json');
const EVIDENCE_FILE = path.join(DATA_DIR, 'evidence.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(STATEMENTS_FILE)) {
  fs.writeFileSync(STATEMENTS_FILE, JSON.stringify([], null, 2));
}

if (!fs.existsSync(EVIDENCE_FILE)) {
  fs.writeFileSync(EVIDENCE_FILE, JSON.stringify([], null, 2));
}

// Statement data operations
export function getAllStatements(): Statement[] {
  try {
    const data = fs.readFileSync(STATEMENTS_FILE, 'utf8');
    return JSON.parse(data) as Statement[];
  } catch (error) {
    console.error('Error reading statements:', error);
    return [];
  }
}

export function getStatementById(id: string): Statement | undefined {
  const statements = getAllStatements();
  return statements.find(statement => statement.id === id);
}

export function createStatement(statement: Omit<Statement, 'id' | 'timestamp' | 'supportingEvidenceCount' | 'refutingEvidenceCount'>): Statement {
  const statements = getAllStatements();
  
  const newStatement: Statement = {
    ...statement,
    id: generateId(),
    timestamp: new Date().toISOString(),
    supportingEvidenceCount: 0,
    refutingEvidenceCount: 0
  };
  
  statements.push(newStatement);
  fs.writeFileSync(STATEMENTS_FILE, JSON.stringify(statements, null, 2));
  
  return newStatement;
}

export function updateStatementEvidenceCounts(statementId: string): void {
  const allEvidence = getAllEvidence();
  const statementEvidence = allEvidence.filter(e => e.statementId === statementId);
  
  const supportingCount = statementEvidence.filter(e => e.stance === 'supporting').length;
  const refutingCount = statementEvidence.filter(e => e.stance === 'refuting').length;
  
  const statements = getAllStatements();
  const updatedStatements = statements.map(s => {
    if (s.id === statementId) {
      return {
        ...s,
        supportingEvidenceCount: supportingCount,
        refutingEvidenceCount: refutingCount
      };
    }
    return s;
  });
  
  fs.writeFileSync(STATEMENTS_FILE, JSON.stringify(updatedStatements, null, 2));
}

// Evidence data operations
export function getAllEvidence(): Evidence[] {
  try {
    const data = fs.readFileSync(EVIDENCE_FILE, 'utf8');
    return JSON.parse(data) as Evidence[];
  } catch (error) {
    console.error('Error reading evidence:', error);
    return [];
  }
}

export function getEvidenceByStatementId(statementId: string): Evidence[] {
  const allEvidence = getAllEvidence();
  return allEvidence.filter(evidence => evidence.statementId === statementId);
}

export function createEvidence(evidence: Omit<Evidence, 'id' | 'timestamp'>): Evidence {
  const allEvidence = getAllEvidence();
  
  const newEvidence: Evidence = {
    ...evidence,
    id: generateId(),
    timestamp: new Date().toISOString()
  };
  
  allEvidence.push(newEvidence);
  fs.writeFileSync(EVIDENCE_FILE, JSON.stringify(allEvidence, null, 2));
  
  // Update statement evidence counts
  updateStatementEvidenceCounts(evidence.statementId);
  
  return newEvidence;
}

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
