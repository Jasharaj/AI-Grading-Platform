'use client';

export type Status = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'in-review'
  | 'graded'
  | 'active'
  | 'completed'
  | 'upcoming'
  | 'resubmitted';

interface StatusChipProps {
  status: Status;
}

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
  },
  'in-review': {
    color: 'bg-blue-100 text-blue-800',
    label: 'In Review',
  },
  approved: {
    color: 'bg-green-100 text-green-800',
    label: 'Approved',
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
  },
  graded: {
    color: 'bg-purple-100 text-purple-800',
    label: 'Graded',
  },
  active: {
    color: 'bg-blue-500 text-white',
    label: 'Active',
  },
  completed: {
    color: 'bg-green-500 text-white',
    label: 'Completed',
  },
  upcoming: {
    color: 'bg-gray-500 text-white',
    label: 'Upcoming',
  },
  'resubmitted': {
    color: 'bg-orange-100 text-orange-800',
    label: 'Resubmitted',
  },
};

export default function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status];
  
  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${config.color}
      `}
    >
      {config.label}
    </span>
  );
}
