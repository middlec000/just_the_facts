'use client';

import { useState } from 'react';
import { EvidenceType, EvidenceStance } from '@/lib/types';

// Form for submitting evidence
export const EvidenceForm = ({ 
  statementId,
  onSubmit, 
  onCancel 
}: { 
  statementId: string,
  onSubmit: (
    statementId: string,
    title: string,
    stance: EvidenceStance,
    type: EvidenceType,
    description: string,
    link?: string
  ) => Promise<void>,
  onCancel: () => void
}) => {
  const [title, setTitle] = useState('');
  const [stance, setStance] = useState<EvidenceStance>('supporting');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('Documentation');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Evidence title is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Evidence description is required');
      return;
    }
    
    // Basic URL validation if link is provided
    if (link && !link.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(
        statementId,
        title,
        stance,
        evidenceType,
        description,
        link || undefined
      );
      
      // Reset form
      setTitle('');
      setDescription('');
      setLink('');
      
      // Close form on successful submission
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Submit Evidence</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-800">Evidence Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your evidence"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Is this evidence supporting or refuting?</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="stance"
                  checked={stance === 'supporting'}
                  onChange={() => setStance('supporting')}
                  className="mr-2"
                />
                Supporting
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="stance"
                  checked={stance === 'refuting'}
                  onChange={() => setStance('refuting')}
                  className="mr-2"
                />
                Refuting
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Evidence Type</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={evidenceType}
              onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
              required
            >
              <option value="Illustrative">Illustrative</option>
              <option value="Documentation">Documentation</option>
              <option value="Testimonial">Testimonial</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block mb-2 font-medium">Evidence Link (Optional)</label>
            <input
              type="url"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Evidence Description</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your evidence"
              required
            />
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
              {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component to display evidence items
export const EvidenceItem = ({ 
  title, 
  description, 
  type,
  link,
  timestamp,
  stance
}: { 
  title: string, 
  description: string, 
  type: EvidenceType,
  link?: string,
  timestamp: string,
  stance: EvidenceStance 
}) => {
  const bgColor = 'bg-white';
  const borderColor = stance === 'supporting' ? 'border-blue-200' : 'border-gray-300';
  const formattedDate = new Date(timestamp).toLocaleDateString();

  return (
    <div className={`${bgColor} rounded-lg p-4 shadow-sm mb-4 border ${borderColor}`}>
      <h3 className="font-semibold text-lg mb-1 text-black">{title}</h3>
      <div className="text-sm text-gray-800 mb-3 flex flex-wrap gap-2">
        <span className="px-2 py-1 bg-white border border-gray-300 rounded-full text-black">{type}</span>
        <span className="px-2 py-1 bg-white border border-gray-300 rounded-full text-black">{formattedDate}</span>
      </div>
      <p className="text-black mb-3">{description}</p>
      {link && (
        <a 
          href={link.startsWith('http') ? link : `https://${link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:underline text-sm block font-medium"
        >
          View Source
        </a>
      )}
    </div>
  );
};
