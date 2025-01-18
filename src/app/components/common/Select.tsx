interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  error?: string;
  defaultOption?: string;
}

export const Select: React.FC<SelectProps> = ({ 
  options, 
  label, 
  error, 
  defaultOption, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-black">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded-lg border border-black/20 px-4 py-2.5 text-black focus:border-purple-500 ${className}`}
        {...props}
      >
        {defaultOption && (
          <option value="">{defaultOption}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
