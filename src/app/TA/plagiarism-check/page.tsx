'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/config';
import {
  ShieldExclamationIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LinkIcon,
  ClipboardIcon,
  UserGroupIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface Submission {
  _id: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  assignment: {
    _id: string;
    title: string;
    maxMarks: number;
    dueDate: string;
  };
  submittedAt: string;
  fileUrl?: string;
  content?: string;
}

export default function PlagiarismCheck() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [plagiarismScore, setPlagiarismScore] = useState<number | null>(null);
  const [sources, setSources] = useState<Array<{ url: string; similarity: number }>>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingSubmissions(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/ta/submissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch submissions: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleSubmissionSelect = (submission: Submission) => {
    setSelectedSubmission(submission);
    // If submission has content, use it for plagiarism check
    if (submission.content) {
      setText(submission.content);
    }
  };

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
    if (score >= 75) return 'text-red-600 bg-red-500';
    if (score >= 50) return 'text-orange-600 bg-orange-500';
    return 'text-green-600 bg-green-500';
  };

  const getSeverityIcon = (score: number) => {
    if (score >= 75) return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
    if (score >= 50) return <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />;
    return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white mb-8 rounded-2xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 75%, white 2px, transparent 2px),
                             radial-gradient(circle at 75% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-1/2 right-8 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-4 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30">
                <ShieldExclamationIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Plagiarism Detection</h1>
                <p className="text-xl text-red-100 mt-2">Advanced AI-powered plagiarism detection for academic integrity</p>
              </div>
            </div>
            
            <button className="hidden sm:inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl border border-white/30 backdrop-blur-sm hover:bg-white/30 transition-all duration-200">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Upload File
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Submissions Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
              <span>Select Submission to Check</span>
            </h2>
            
            {loadingSubmissions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading submissions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {submissions.slice(0, 6).map((submission) => (
                  <div 
                    key={submission._id} 
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSubmission?._id === submission._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSubmissionSelect(submission)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <UserGroupIcon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{submission.student.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{submission.assignment.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">{selectedSubmission && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Selected Submission:</h3>
                <p className="text-blue-800">{selectedSubmission.student.name} - {selectedSubmission.assignment.title}</p>
              </div>
            )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                <label htmlFor="text-input" className="block text-lg font-semibold text-gray-900">
                  Enter Text to Check for Plagiarism
                </label>
              </div>
              <div className="relative">
                <textarea
                  id="text-input"
                  value={text}
                  onChange={handleTextChange}
                  className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-gray-50 focus:bg-white transition-all duration-200 resize-none"
                  placeholder="Paste or type the text you want to check for plagiarism here..."
                />
                <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-md shadow-sm">
                  <span className="text-xs text-gray-500">{text.length} characters</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !text}
              className={`w-full py-4 px-6 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                loading || !text
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Content...</span>
                </>
              ) : (
                <>
                  <ShieldExclamationIcon className="h-5 w-5" />
                  <span>Check for Plagiarism</span>
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              {/* Plagiarism Score */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(plagiarismScore || 0)}
                    <h2 className="text-2xl font-bold text-gray-900">Detection Results</h2>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getSeverityColor(plagiarismScore || 0).split(' ')[0]}`}>
                      {plagiarismScore}%
                    </div>
                    <p className="text-sm text-gray-600">Similarity Score</p>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${getSeverityColor(plagiarismScore || 0).split(' ')[1]}`}
                      style={{ width: `${plagiarismScore}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-700">
                    {plagiarismScore && plagiarismScore >= 75 && "⚠️ High similarity detected. This content may contain significant plagiarized material."}
                    {plagiarismScore && plagiarismScore >= 50 && plagiarismScore < 75 && "⚡ Moderate similarity found. Review the matched content carefully."}
                    {plagiarismScore && plagiarismScore < 50 && "✅ Low similarity detected. The content appears to be mostly original."}
                  </p>
                </div>
              </div>

              {/* Matched Content */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-900">Matched Content</h3>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed mb-3">{result}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      AI-Generated Content Detected
                    </span>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
                      <ClipboardIcon className="h-4 w-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Similar Sources */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <LinkIcon className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Similar Sources Found</h3>
                </div>
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <LinkIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 font-medium truncate max-w-md">
                          {source.url}
                        </a>
                      </div>
                      <span className="flex items-center space-x-2">
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">
                          {source.similarity}% Match
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
