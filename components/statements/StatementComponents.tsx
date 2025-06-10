'use client';

import { useState } from 'react';
import { Statement, StatementType } from '@/lib/types';
import Link from 'next/link';

// Statement Card Component for the home page
export const StatementCard = ({ statement }: { statement: Statement }) => {
  return (
    <Link href={`/statements/${statement.id}`} 
          className="block p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow mb-4">
      <div className="font-semibold text-lg mb-3 p-3 bg-gray-800 text-white rounded-md">{statement.text}</div>
      <div className="flex justify-between text-sm text-gray-900">
        <div className="font-medium">Type: {statement.type}</div>
        <div className="flex space-x-4">
          <span className="bg-white text-black px-2 py-1 rounded border border-gray-300 font-medium">
            Supporting: {statement.supportingEvidenceCount}
          </span>
          <span className="bg-white text-black px-2 py-1 rounded border border-gray-300 font-medium">
            Refuting: {statement.refutingEvidenceCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

// Form for creating a new statement
export const CreateStatementForm = ({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (text: string, type: StatementType) => Promise<void>,
  onCancel: () => void
}) => {
  const [text, setText] = useState('');
  const [type, setType] = useState<StatementType>('Argument');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Statement text is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(text, type);
      setText('');
      setType('Argument');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit statement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Create a New Statement</h2>
        
        <div className="bg-blue-100 p-4 rounded-md mb-6 text-sm text-gray-900 border border-blue-200">
          <p className="font-medium mb-2 text-gray-900">Please only submit objective and thoughtful Statements.</p>
          <p className="mb-1 text-gray-900">Think of Statements as things that could be proved true or false in some kind of court. They should have the following qualities:</p>
          <ol className="list-decimal list-inside ml-2 space-y-1 text-gray-900">
            <li><strong>Provable/Falsifiable</strong> - Must be able to be proved true or false</li>
            <li><strong>Clear and Precise</strong> - Stated in a clear, unambiguous way</li>
            <li><strong>Specific</strong> - The narrower the topic of the statement the easier it will be to prove true or false</li>
            <li><strong>Relevant</strong> - The statement should be of some importance or interest</li>
          </ol>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800">Statement</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your statement"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">Statement Type</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              value={type}
              onChange={(e) => setType(e.target.value as StatementType)}
              required
            >
              <option value="Quote">Quote</option>
              <option value="Argument">Argument</option>
              <option value="Learn">Learn</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
