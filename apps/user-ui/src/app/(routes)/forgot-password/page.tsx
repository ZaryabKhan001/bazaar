'use client';
import { useMutation } from '@tanstack/react-query';
import Otp from 'apps/user-ui/src/shared/components/Otp';
import React, { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from 'apps/user-ui/src/lib/api';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

type formData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [userData, setUserData] = useState<formData | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: formData) => {
      const response = await api.post('/auth/api/forgot-password-user', data);
      return response?.data;
    },
    onSuccess: (_, formData) => {
      setServerError(null);
      setUserData(formData);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
      setStep('otp');
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || 'Failed to proceed!';
      setServerError(errorMessage);
    },
  });

  const resetPaswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      console.log('password', password);
      if (!password) {
        throw new Error('Password is required');
      };
      const response = await api.post('/auth/api/reset-password-user', {
        email: userData?.email,
        newPassword: password,
      });
      return response.data;
    },
    onSuccess: () => {
      setStep('email');
      setServerError(null);
      router.push('/login');
      toast.success('Password reset Successfully! Please login with your new Password.');
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || 'Failed to proceed!';
      setServerError(errorMessage);
    },
  });

  const startResendTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const onSubmit = (data: formData) => {
    forgotPasswordMutation.mutate(data);
  };

  const onSubmitPassword = async (data: formData) => {
    resetPaswordMutation.mutate({ password: data.password as string });
  };

  const handleResendOtp = () => {
    setServerError(null);
    setOtp(['', '', '', '']);
    if (userData) {
      forgotPasswordMutation.mutate(userData);
    }
  };

  const handleOTPSuccess = () => {
    setServerError(null);
    setStep('reset');
  };

  const verifyOtpUrl = useMemo(() => '/auth/api/verify-forgot-password-user', []);
  const verifyOtpMutationOptions = useMemo(() => {
    return { email: userData?.email, otp: otp.join('') };
  }, [userData, otp]);
  return (
    <div className='w-full py-10 min-h-[85vh] bg-primary-backgroundDull '>
      <h1 className='text-3xl font-Poppins font-semibold text-black text-center'>Forgot Password</h1>
      <p className='text-center text-lg font-medium py-3 text-[#00000099]'>Home . Forgot Password</p>
      <div className='w-full flex justify-center'>
        <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
          <h3 className='text-2xl font-bold text-center mb-12 font-Poppins'>
            <p>No Worries</p>
            <p>We're here for you!</p>
          </h3>
          {/* form  */}
          {step === 'email' && (
            <form onSubmit={handleSubmit(onSubmit)}>
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

              <button
                type='submit'
                className='w-full text-md cursor-pointer bg-primary-main text-white py-2 rounded-md mt-4'
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? 'Sending OTP...' : 'Submit'}
              </button>
              {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            </form>
          )}
          {step === 'otp' && (
            <Otp
              otp={otp}
              setOtp={setOtp}
              canResend={canResend}
              setCanResend={setCanResend}
              timer={timer}
              setTimer={setTimer}
              inputRefs={inputRefs}
              userData={userData}
              verifyOtpUrl={verifyOtpUrl}
              verifyOtpMutationOptions={verifyOtpMutationOptions}
              handleResendOtp={handleResendOtp}
              handleOnSuccess={handleOTPSuccess}
            />
          )}
          {step === 'reset' && (
            <form onSubmit={handleSubmit(onSubmitPassword)}>
              <label className='block text-gray-700 mb-1 font-semibold'>Enter new password</label>

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

              <button
                type='submit'
                className='w-full text-md cursor-pointer bg-primary-main text-white py-2 rounded-md mt-4'
                disabled={resetPaswordMutation.isPending}
              >
                {resetPaswordMutation.isPending ? 'Submitting...' : 'Submit'}
              </button>
              {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
