/* eslint-disable @typescript-eslint/no-empty-function */
import { Dispatch, SetStateAction, RefObject } from 'react';

export interface OtpProps {
  otp: string[];
  setOtp: Dispatch<SetStateAction<string[]>>;
  canResend: boolean;
  setCanResend: Dispatch<SetStateAction<boolean>>;
  timer: number;
  setTimer: Dispatch<SetStateAction<number>>;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
}

const Otp = ({ otp, inputRefs, setOtp, canResend, timer }: OtpProps) => {
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

  const handleResendOtp = () => {};

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
      <button type='button' className='w-full mt-4 text-lg cursor-pointer bg-primary-main text-white py-2 rounded-md'>
        Verify OTP
      </button>
      <div className='text-center text-sm mt-4 '>
        {canResend ? (
          <button
            className='text-primary-main cursor-pointer'
            onClick={handleResendOtp}
            disabled={!canResend || !!timer}
          >
            Resend OTP
          </button>
        ) : (
          <p>{`Resend OTP in ${timer} seconds.`}</p>
        )}
      </div>
    </div>
  );
};

export default Otp;
