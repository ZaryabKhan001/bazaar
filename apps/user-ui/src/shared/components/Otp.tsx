import { useMutation } from '@tanstack/react-query';
import { Dispatch, SetStateAction, RefObject } from 'react';
import { api } from '../../lib/api';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

type formData = {
  name: string;
  email: string;
  password: string;
};
export interface OtpProps {
  otp: string[];
  setOtp: Dispatch<SetStateAction<string[]>>;
  canResend: boolean;
  setCanResend: Dispatch<SetStateAction<boolean>>;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  userData: formData | null;
}

const Otp = ({ otp, inputRefs, setOtp, canResend, timer, userData }: OtpProps) => {
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputRefs.current[index]?.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    console.log('resend call');
  };

  const handleVerifyOTP = () => {
    verifyOtpMutation.mutate();
  };

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userData) return;
      const response = await api.post('/auth/api/verify-user', { ...userData, otp: otp.join('') });
      return response.data;
    },
    onSuccess: () => {
      router.push('/login');
    },
  });

  return (
    <div>
      <h3 className='text-xl font-semibold text-center mb-4'>Enter OTP</h3>
      <div className='flex justify-center gap-6'>
        {otp?.map((digit: string, index: number) => (
          <input
            key={index}
            type='text'
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            maxLength={1}
            className='w-12 h-12 text-center border border-gray-300 outline-none rounded-md'
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(index, e)}
          />
        ))}
      </div>
      <button
        type='button'
        className='w-full mt-4 text-lg cursor-pointer bg-primary-main text-white py-2 rounded-md'
        onClick={handleVerifyOTP}
        disabled={verifyOtpMutation.isPending}
      >
        {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
      </button>
      <div className='text-center text-sm mt-4 '>
        {canResend ? (
          <button
            type='button'
            className='text-primary-main cursor-pointer'
            onClick={handleResendOtp}
            disabled={!canResend || !!timer}
          >
            Resend OTP
          </button>
        ) : (
          <p>{`Resend OTP in ${timer} seconds.`}</p>
        )}
        {verifyOtpMutation.isError && verifyOtpMutation.error instanceof AxiosError && (
          <p className='text-sm mt-2'>
            {verifyOtpMutation.error.response?.data?.message ||
              verifyOtpMutation.error.message ||
              'OTP Verification Failed'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Otp;
