'use client';

import { useState } from 'react';

export default function Analytics() {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Course Performance Analytics</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-black">Performance Dashboard</h2>
            <p className="text-black">View comprehensive analytics and insights about course performance.</p>
          </div>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
          </button>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-1">Total Students</h3>
            <p className="text-2xl font-bold text-blue-600">150</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-1">Average Score</h3>
            <p className="text-2xl font-bold text-green-600">85%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-1">Submissions</h3>
            <p className="text-2xl font-bold text-purple-600">450</p>
          </div>
        </div>

        {showDashboard && (
          <div className="mt-4">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <iframe
                title="Course Performance Dashboard"
                width="100%"
                height="700"
                src="https://app.powerbi.com/view?r=eyJrIjoiOTU5Mjk4OTQtOTI0MC00YjEwLTk3MjktMDQwYzVjYzBmN2UwIiwidCI6ImJhZDEyODY0LTkxM2UtNGI5OS04N2Q2LWI4ZDJhZDQ1OWUyNyIsImMiOjEwfQ%3D%3D"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
