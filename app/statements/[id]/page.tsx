'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatementType } from '@/lib/types';
import { getStatementById, getEvidenceByStatementId, createEvidence } from '@/lib/data/actions';
import { EvidenceItem, EvidenceForm } from '@/components/evidence/EvidenceComponents';
import { formatDate } from '@/lib/utils';

export default function StatementPage({ params }: { params: { id: string } }) {
  const [statement, setStatement] = useState<any>(null);
  const [supportingEvidence, setSupportingEvidence] = useState<any[]>([]);
  const [refutingEvidence, setRefutingEvidence] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const statementData = await getStatementById(params.id);
        if (!statementData) {
          setError('Statement not found');
          setIsLoading(false);
          return;
        }

        setStatement(statementData);

        const evidenceData = await getEvidenceByStatementId(params.id);
        setSupportingEvidence(evidenceData.supporting);
        setRefutingEvidence(evidenceData.refuting);
      } catch (err) {
        setError('Error loading statement');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleEvidenceSubmit = async (
    statementId: string,
    title: string,
    stance: 'supporting' | 'refuting',
    type: 'Illustrative' | 'Documentation' | 'Testimonial',
    description: string,
    link?: string
  ) => {
    try {
      await createEvidence(statementId, title, stance, type, description, link);
      
      // Refresh evidence data
      const evidenceData = await getEvidenceByStatementId(params.id);
      setSupportingEvidence(evidenceData.supporting);
      setRefutingEvidence(evidenceData.refuting);
      
      // Refresh statement data (to update counts)
      const statementData = await getStatementById(params.id);
      if (statementData) {
        setStatement(statementData);
      }
    } catch (err) {
      console.error('Failed to submit evidence:', err);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !statement) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error || 'Statement not found'}
        </div>
        <Link href="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-blue-600 hover:underline mr-4">
          &larr; Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 p-4 bg-gray-800 text-white rounded-lg shadow-md">{statement.text}</h1>
        <div className="flex flex-wrap gap-4 mb-4 text-sm">
          <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-black font-medium">{statement.type}</span>
          <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-black font-medium">
            Supporting: {statement.supportingEvidenceCount}
          </span>
          <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-black font-medium">
            Refuting: {statement.refutingEvidenceCount}
          </span>
          <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-black font-medium">
            Submitted: {formatDate(statement.timestamp)}
          </span>
        </div>
        
        <button
          onClick={() => setShowEvidenceForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors mt-2"
        >
          Add Evidence
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supporting Evidence Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-white text-black p-2 border border-gray-300">
            Supporting Evidence ({supportingEvidence.length})
          </h2>
          {supportingEvidence.length > 0 ? (
            <div className="space-y-4">
              {supportingEvidence.map((evidence) => (
                <EvidenceItem
                  key={evidence.id}
                  title={evidence.title}
                  description={evidence.description}
                  type={evidence.type}
                  link={evidence.link}
                  timestamp={evidence.timestamp}
                  stance="supporting"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-300">
              <p className="text-gray-700 font-medium">No supporting evidence yet.</p>
            </div>
          )}
        </div>
        
        {/* Refuting Evidence Column */}
        <div>
          <h2 className="text-xl font-semibold mb-4 bg-white text-black p-2 border border-gray-300">
            Refuting Evidence ({refutingEvidence.length})
          </h2>
          {refutingEvidence.length > 0 ? (
            <div className="space-y-4">
              {refutingEvidence.map((evidence) => (
                <EvidenceItem
                  key={evidence.id}
                  title={evidence.title}
                  description={evidence.description}
                  type={evidence.type}
                  link={evidence.link}
                  timestamp={evidence.timestamp}
                  stance="refuting"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-300">
              <p className="text-gray-700 font-medium">No refuting evidence yet.</p>
            </div>
          )}
        </div>
      </div>
      
      {showEvidenceForm && (
        <EvidenceForm
          statementId={statement.id}
          onSubmit={handleEvidenceSubmit}
          onCancel={() => setShowEvidenceForm(false)}
        />
      )}
    </div>
  );
}
