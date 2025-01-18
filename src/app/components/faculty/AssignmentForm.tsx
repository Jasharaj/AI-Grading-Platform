'use client';

import React, { useState } from 'react';
import { Card } from '../common/Card';

interface TA {
  id: string;
  name: string;
}

interface AssignmentFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
}

export const AssignmentForm = ({ onSubmit, onCancel, initialData }: AssignmentFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    dueDate: initialData?.dueDate || '',
    maxMarks: initialData?.maxMarks || '',
    selectedTAs: initialData?.selectedTAs || [],
    status: initialData?.status || 'draft',
    gradingStatus: initialData?.gradingStatus || 'not_started',
    hasRubric: initialData?.hasRubric || false,
    rubricFile: null as File | null,
  });

  // Mock TAs data - in real app, this would come from an API
  const availableTAs: TA[] = [
    { id: '1', name: 'Alex Johnson' },
    { id: '2', name: 'Sarah Williams' },
    { id: '3', name: 'Mike Brown' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      setFormData({ ...formData, rubricFile: file, hasRubric: true });
    } else if (file) {
      alert('Please upload a PDF or text file');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card title={initialData ? 'Edit Assignment' : 'Create New Assignment'}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-black">Assignment Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black placeholder-black/60 focus:border-purple-500 focus:ring-purple-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black placeholder-black/60 focus:border-purple-500 focus:ring-purple-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Due Date</label>
          <input
            type="datetime-local"
            required
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black focus:border-purple-500 focus:ring-purple-500"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Maximum Marks</label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black placeholder-black/60 focus:border-purple-500 focus:ring-purple-500"
            value={formData.maxMarks}
            onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Status</label>
          <select
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black focus:border-purple-500 focus:ring-purple-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft" className="text-black">Draft</option>
            <option value="active" className="text-black">Active</option>
            <option value="completed" className="text-black">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Grading Status</label>
          <select
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black focus:border-purple-500 focus:ring-purple-500"
            value={formData.gradingStatus}
            onChange={(e) => setFormData({ ...formData, gradingStatus: e.target.value })}
          >
            <option value="not_started" className="text-black">Not Started</option>
            <option value="in_progress" className="text-black">In Progress</option>
            <option value="completed" className="text-black">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">Rubric</label>
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="mt-1 block w-full text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {formData.hasRubric && !formData.rubricFile && initialData?.hasRubric && (
              <p className="text-sm text-black/60">
                A rubric file is already attached. Upload a new file to replace it.
              </p>
            )}
            {formData.rubricFile && (
              <p className="text-sm text-purple-600">
                New rubric file selected: {formData.rubricFile.name}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Assign TAs</label>
          <select
            multiple
            className="mt-1 block w-full rounded-md border border-black/20 px-3 py-2 text-black focus:border-purple-500 focus:ring-purple-500"
            value={formData.selectedTAs}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              setFormData({ ...formData, selectedTAs: selected });
            }}
          >
            {availableTAs.map((ta) => (
              <option key={ta.id} value={ta.id} className="text-black">
                {ta.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-black/60">Hold Ctrl/Cmd to select multiple TAs</p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-black/20 rounded-md text-black hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {initialData ? 'Update Assignment' : 'Create Assignment'}
          </button>
        </div>
      </form>
    </Card>
  );
};
