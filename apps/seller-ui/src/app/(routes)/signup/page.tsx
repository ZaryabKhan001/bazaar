'use client';
import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AxiosError } from 'axios';
import { FormInput, Stepper, FormSelect, Otp } from '../../../shared/components/index';
import { axiosInstance } from '../../../utils/axiosInstance';
import { countries } from '../../../constants/countries';
import Link from 'next/link';

type formData = {
  name: string;
  email: string;
  phone_number: string;
  password: string;
  country: string;
};

const Signup = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [userData, setUserData] = useState<formData | null>(null);
  const [timer, setTimer] = useState<number>(60);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeStep, setActiveStep] = useState<number>(1);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>();

  const signupMutation = useMutation({
    mutationFn: async (data: formData) => {
      const response = await axiosInstance.post('/auth/api/user-registration', data);
      return response?.data;
    },
    onSuccess: (_, formData) => {
      setServerError(null);
      setUserData(formData);
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })?.message || 'SignUp Failed!';
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
    signupMutation.mutate(data);
  };

  const handleResendOtp = useCallback(() => {
    if (!userData) return;
    signupMutation.mutate(userData);
  }, []);

  const handleOnSuccess = useCallback(() => {
    setActiveStep(activeStep + 1);
  }, []);

  const onStepChange = (val: number) => {
    setActiveStep(val);
  };

  const steps = useMemo(
    () => [
      { id: 1, title: 'Create Account' },
      { id: 2, title: 'Setup Shop' },
      { id: 3, title: 'Connect Bank' },
    ],
    [],
  );

  const verifyOtpUrl = useMemo(() => '/auth/api/verify-user', []);
  const verifyOtpMutationOptions = useMemo(() => {
    return { ...userData, otp: otp.join('') };
  }, [userData, otp]);

  return (
    <div className='w-full flex flex-col items-center pt-10 min-h-screen'>
      {/* stepper  */}
      <Stepper steps={steps} activeStep={activeStep} onStepChange={onStepChange} />
      {/* step wise content  */}
      <div className='md:w-[480px] p-8 bg-white shadow rounded-lg mt-8'>
        {activeStep === 1 && (
          <>
            {!showOtp ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-2xl font-semibold text-center mb-4'>Create Account</h3>
                <FormInput
                  label='Name'
                  name='name'
                  type='text'
                  placeholder='John Doe'
                  register={register}
                  rules={{
                    required: 'Name is Required',
                  }}
                  error={errors.name}
                />
                <FormInput
                  label='Email'
                  name='email'
                  type='email'
                  placeholder='example@gmail.com'
                  register={register}
                  rules={{
                    required: 'Email is Required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Invalid email address',
                    },
                  }}
                  error={errors.email}
                />
                <FormInput
                  label='Phone Number'
                  name='phone_number'
                  type='tel'
                  placeholder='+92**********'
                  register={register}
                  rules={{
                    required: 'Phone is Required',
                    pattern: {
                      value: /^\+?[1-9]\d{1,14}$/,
                      message: 'Invalid phone number format',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                    maxLength: {
                      value: 15,
                      message: 'Phone number cannot exceed 15 digits',
                    },
                  }}
                  error={errors.phone_number}
                />
                <FormSelect
                  label='Select your Country'
                  name='country'
                  options={countries}
                  register={register}
                  rules={{
                    required: 'Country Selection is required',
                  }}
                  error={errors.country}
                />
                <FormInput
                  label='Password'
                  name='password'
                  type={'password'}
                  placeholder='Min. 6 characters'
                  register={register}
                  rules={{
                    required: 'Password is Required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters.',
                    },
                  }}
                  error={errors.password}
                />

                <button
                  type='submit'
                  className='w-full text-md cursor-pointer bg-primary-main text-white py-2 rounded-md mt-4'
                  disabled={signupMutation.isPending}
                >
                  {signupMutation.isPending ? 'Singing up...' : 'SignUp'}
                </button>
                {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
                <p className='pt-3 text-center' >
                  Already have an account? <Link href={'/login'} className='text-primary-main font-semibold'>Login</Link>
                </p>
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
                userData={userData}
                verifyOtpUrl={verifyOtpUrl}
                verifyOtpMutationOptions={verifyOtpMutationOptions}
                handleResendOtp={handleResendOtp}
                handleOnSuccess={handleOnSuccess}
              />
            )}
          </>
        )}
        {activeStep === 2 && <></>}

        {activeStep === 3 && <></>}
      </div>
    </div>
  );
};

export default Signup;
