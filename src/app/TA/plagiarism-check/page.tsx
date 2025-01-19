'use client';

import { useState } from 'react';

export default function PlagiarismCheck() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/plagiarism-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to check plagiarism');
      }

      const result = await response.json();
      console.log(result["Output"]);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-black">AI Plagiarism Check</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="text-input" className="block text-lg font-medium text-black">
                Enter Text to Check
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={handleTextChange}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                placeholder="Enter the text you want to check for plagiarism..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || !text}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg transition-colors ${
                loading || !text
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Checking...' : 'Check for Plagiarism'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
