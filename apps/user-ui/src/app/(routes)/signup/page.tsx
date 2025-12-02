'use client';
import GoogleButton from 'apps/user-ui/src/shared/components/GoogleButton';
import Otp from 'apps/user-ui/src/shared/components/Otp';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type formData = {
  name: string;
  email: string;
  password: string;
};

const Signup = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [userData, setUserData] = useState<formData | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const onSubmit = (data: formData) => {};

  return (
    <div className='w-full py-10 min-h-[85vh] bg-primary-backgroundDull '>
      <h1 className='text-3xl font-Poppins font-semibold text-black text-center'>Sign up</h1>
      <p className='text-center text-lg font-medium py-3 text-[#00000099]'>Home . Sign up</p>
      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
          <h3 className='text-2xl font-bold text-center mb-2 font-Poppins'>Sign up to Bazaar</h3>
          <p className='text-center text-gray-500 mb-4'>
            Already have an account?{' '}
            <Link href='/login' className='text-primary-main font-semibold'>
              Login
            </Link>
          </p>
          <GoogleButton />
          <div className='flex items-center my-5 text-gray-400 text-sm'>
            <div className='flex-1 border-t border-gray-300'></div>
            <span className='px-3'> or Sign In with Email</span>
            <div className='flex-1 border-t border-gray-300'></div>
          </div>
          {/* form  */}
          {!showOtp ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className='block text-gray-700 mb-1 font-semibold'>Name</label>
              <input
                type='text'
                placeholder='John Doe'
                className='w-full p-2 border border-gray-300 outline-0 rounded-md mb-1'
                {...register('name', {
                  required: 'Name is Required',
                })}
              />
              {errors.email && <p className='text-sm text-red-500'>{String(errors.email.message)}</p>}
              <label className='block text-gray-700 mb-1 font-semibold'>Email</label>
              <input
                type='email'
                placeholder='example@gmail.com'
                className='w-full p-2 border border-gray-300 outline-0 rounded-md mb-1'
                {...register('email', {
                  required: 'Email is Required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className='text-sm text-red-500'>{String(errors.email.message)}</p>}
              <label className='block text-gray-700 mb-1 font-semibold'>Password</label>

              <div className='relative'>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder='Min. 6 characters'
                  className='w-full p-2 border border-gray-300 outline-0 rounded-md mb-1'
                  {...register('password', {
                    required: 'Password is Required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters.',
                    },
                  })}
                />
                <button
                  type='button'
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className='absolute inset-y-0 right-3 flex items-center text-gray-400'
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
              </div>
              {errors.password && <p className='text-sm text-red-500'>{String(errors.password.message)}</p>}

              <button type='submit' className='w-full text-md cursor-pointer bg-primary-main text-white py-2 rounded-md mt-4'>
                SignUp
              </button>
              {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            </form>
          ) : (
            <Otp
              otp={otp}
              setOtp={setOtp}
              canResend={canResend}
              setCanResend={setCanResend}
              timer={timer}
              setTimer={setTimer}
              inputRefs={inputRefs}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
