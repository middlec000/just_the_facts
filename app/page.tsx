'use client';

import { useState, useEffect } from 'react';
import { StatementCard, CreateStatementForm } from '@/components/statements/StatementComponents';
import { Statement } from '@/lib/types';
import { getAllStatements, createStatement } from '@/lib/data/actions';

export default function Home() {
  const [statements, setStatements] = useState<Statement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sortOrder, setSortOrder] = useState<'most' | 'least'>('most');

  // Fetch statements
  const fetchStatements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStatements(sortOrder);
      setStatements(data);
    } catch (err) {
      setError('Failed to load statements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStatements();
  }, [sortOrder]);

  // Handle statement creation
  const handleCreateStatement = async (text: string, type: Statement['type']) => {
    try {
      await createStatement(text, type);
      setShowCreateForm(false);
      fetchStatements();
    } catch (err) {
      console.error('Failed to create statement:', err);
      throw err;
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Just the Facts</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="sort-order" className="mr-2 text-sm">Sort by:</label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'most' | 'least')}
              className="border rounded-md p-1 text-sm"
            >
              <option value="most">Most Evidence</option>
              <option value="least">Least Evidence</option>
            </select>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            New Statement
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : statements.length > 0 ? (
        <div className="space-y-4">
          {statements.map((statement) => (
            <StatementCard key={statement.id} statement={statement} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No statements found.</p>
          <p className="mt-2">Be the first to create a statement!</p>
        </div>
      )}

      {showCreateForm && (
        <CreateStatementForm 
          onSubmit={handleCreateStatement}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </main>
  );
}
