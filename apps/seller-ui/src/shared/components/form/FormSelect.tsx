import React from 'react';
import { UseFormRegister, RegisterOptions, FieldError } from 'react-hook-form';

interface Option {
  label: string;
  value: string | number;
}

interface FormSelectProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  rules?: RegisterOptions;
  error?: FieldError;
  options: Option[];
}

const FormSelect = ({ name, label, register, rules, error, options }: FormSelectProps) => {
  return (
    <div>
      <label className="block text-gray-700 mb-1 font-semibold">
        {label}
      </label>

      <select
        {...register(name, rules)}
        className="w-full p-2 border border-gray-300 rounded-md mb-1"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="text-sm text-red-500">{String(error.message)}</p>}
    </div>
  );
};

export default FormSelect;
