import React from 'react'

export default function TADashboard() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to TA Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Assigned Courses</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div>
              <p className="text-gray-600">Pending Evaluations</p>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-purple-600 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>Evaluated CS101 Assignment #3</p>
              <p className="text-xs">2 hours ago</p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Added feedback for CS202 Project</p>
              <p className="text-xs">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
