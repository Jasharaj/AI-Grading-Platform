import React from 'react';
import { Card } from '../common/Card';

export const QuickLinks = () => {
  return (
    <Card title="Quick Links">
      <div className="space-y-4">
        <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition">
          Create New Assignment
        </button>
        <button className="w-full bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
          View Re-evaluation Requests
        </button>
      </div>
    </Card>
  );
};
