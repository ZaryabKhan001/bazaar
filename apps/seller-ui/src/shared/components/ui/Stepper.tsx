import React from 'react';

interface StepperProps {
  steps: Record<string, any>[];
  activeStep: number;
  onStepChange: (val: number) => void;
  className?: string;
}

const Stepper = ({ steps, activeStep, onStepChange }: StepperProps) => {
  return (
    <div className='relative flex items-center justify-between md:w-[50%] mb-8'>
      <div className='absolute top-[25%] left-0 w-[80%] md:w-[90%] h-1 bg-gray-300 -z-10' />
        {steps.map((step) => (
          <div key={step?.id}>
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full text-white font-bold cursor-pointer ${
                step?.id <= activeStep ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => onStepChange(step?.id)}
            >
              {step?.id}
            </div>
            <span className='ml-[-15px] text-sm font-semibold'>{step?.title}</span>
          </div>
        ))}
    </div>
  );
};

export default Stepper;
