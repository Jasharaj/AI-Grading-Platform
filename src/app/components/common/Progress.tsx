interface ProgressProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max, 
  showLabel = true, 
  className = '' 
}) => {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-black">
          <span>{value}/{max}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-black/10 rounded-full h-2">
        <div 
          className="bg-purple-600 h-2 rounded-full" 
          style={{ width: `${percentage}%` }} 
        />
      </div>
    </div>
  );
};
