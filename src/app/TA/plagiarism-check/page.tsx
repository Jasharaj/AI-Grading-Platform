'use client';

import { useState } from 'react';

export default function PlagiarismCheck() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [sources, setSources] = useState<Array<{ url: string; similarity: number }>>([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const plagiarismText = "Cultural diversity and its influence on society: With the advancements in technology, this topic has gained tremendous significance. AI models and algorithms have been used to analyze and simulate complex scenarios, offering insights and predictions. These technologies assist in making data-driven decisions. For instance, AI-driven solutions are now widely used to optimize resources, forecast trends, and automate mundane tasks. The impact of such technologies can be profound as they help improve efficiency and productivity. Despite the potential, there are concerns about the ethical and societal implications of AI adoption. It is crucial to address these challenges to harness AI's full potential responsibly.";
    
    // Set static results
    setResult(plagiarismText);
    setPlagiarismScore(78);
    setSources([
      { url: "https://example.com/article1", similarity: 45 },
      { url: "https://example.com/article2", similarity: 33 },
    ]);
    setLoading(false);
  };

  const getSeverityColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-500';
    return 'text-green-500';
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

          {result && (
            <div className="mt-6">
              {/* Plagiarism Score */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-black">Plagiarism Detection Results</h2>
                  <div className={`text-2xl font-bold ${getSeverityColor(plagiarismScore || 0)}`}>
                    {plagiarismScore}% Match
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getSeverityColor(plagiarismScore || 0)}`}
                    style={{ width: `${plagiarismScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Matched Content */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-2">Matched Content</h3>
                <p className="text-black mb-2">{result}</p>
                <p className="text-sm text-gray-600 italic">AI-Generated</p>
              </div>

              {/* Similar Sources */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">Similar Sources Found</h3>
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                      <span className="text-blue-600 hover:underline">{source.url}</span>
                      <span className="font-medium text-gray-700">{source.similarity}% Similar</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
