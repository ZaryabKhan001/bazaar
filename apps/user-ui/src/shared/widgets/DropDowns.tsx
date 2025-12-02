import { AlignLeft, ChevronDown } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

interface DropDownsInterface {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  isSticky: boolean;
}

const DropDowns = ({ show, setShow, isSticky }: DropDownsInterface) => {
  return (
    <div
      className={`w-[260px] cursor-pointer flex items-center justify-between px-4 h-[50px] bg-primary-main ${
        isSticky && '-mb-2'
      }`}
      onClick={() => setShow(!show)}
    >
      <div className='flex items-center justify-between gap-2 w-full '>
        <div className='flex items-center gap-2'>
          <AlignLeft color='#fff' />
          <span className='text-white font-medium'>All Departments</span>
        </div>

        <ChevronDown
          color='white'
          className={`transform transition-transform duration-200 ease-linear ${show ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>
      {/* list  */}
      {show && (
        <div
          className={`absolute left-0 ${
            isSticky ? 'top-[70px]' : 'top-[50px]'
          } w-[260px] h-[400px] bg-primary-drpopdownBox`}
        ></div>
      )}
    </div>
  );
};

export default DropDowns;
