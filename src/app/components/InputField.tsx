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
      <label className="text-black text-sm mb-2 block">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="bg-white w-full text-black text-sm px-4 py-3 border border-gray-300 focus:border-purple-600 outline-none transition-all rounded-md"
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;