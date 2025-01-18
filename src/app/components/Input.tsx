interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({
  label,
  id,
  type = "text",
  required = true,
  placeholder,
  value,
  onChange
}: InputProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="text-gray-800 text-sm mb-2 block">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          className="w-full text-sm text-gray-800 border border-gray-300 pl-4 pr-10 py-3 rounded-lg outline-purple-600"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Input;
