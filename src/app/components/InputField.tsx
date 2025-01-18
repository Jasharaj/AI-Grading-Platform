import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({ label, name, type, placeholder, value, onChange }: InputFieldProps) => {
  return (
    <div>
      <label className="text-gray-800 text-sm mb-2 block">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 focus:bg-transparent border border-gray-100 focus:border-purple-600 outline-none transition-all"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
