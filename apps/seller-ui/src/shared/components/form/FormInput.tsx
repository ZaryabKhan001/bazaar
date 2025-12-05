import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { RegisterOptions, FieldError, UseFormRegister } from 'react-hook-form';

type InputType = 'text' | 'email' | 'password' | 'number' | 'textarea' | 'tel';

interface FormInputProps {
  name: string;
  label: string;
  placeholder: string;
  type: InputType;
  register: UseFormRegister<any>;
  rules: RegisterOptions;
  error: FieldError | undefined;
}

const FormInput = ({ name, label, placeholder, type = 'text', register, rules, error }: FormInputProps) => {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const isPasswordType = type === 'password';
  return (
    <div>
      <div className='relative'>
        <label className='block text-gray-700 mb-1 font-semibold'>{label}</label>
        <input
          type={isPasswordType && passwordVisible ? 'text' : type}
          placeholder={placeholder}
          className='w-full p-2 border border-gray-300 rounded-md outline-none mb-1'
          {...register(name, rules)}
        />
        {isPasswordType && (
          <button
            type='button'
            onClick={() => setPasswordVisible(!passwordVisible)}
            className='h-full absolute top-[65%] right-3 -translate-y-1/2 flex items-center text-gray-400'
          >
            {passwordVisible ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>

      {error && <p className='text-sm text-red-500'>{String(error.message)}</p>}
    </div>
  );
};

export default FormInput;
