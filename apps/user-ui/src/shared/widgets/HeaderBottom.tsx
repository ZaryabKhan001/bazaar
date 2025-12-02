'use client';
import React, { useEffect, useState } from 'react';
import DropDowns from './DropDowns';
import { navItems } from '../../configs/constants';
import Link from 'next/link';
import ProfileIcon from '../../assets/svgs/ProfileIcon';
import { Handbag, Heart } from 'lucide-react';

const HeaderBottom = () => {
  const [show, setShow] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full transition-all duration-300 ease-linear ${
        isSticky ? 'fixed top-0 left-0 z-100 bg-white shadow-lg pb-5' : 'relative'
      }`}
    >
      <div className='max-w-[1400px] pl-4 pr-4 mx-auto'>
        <div className={`relative flex justify-between items-center ${isSticky ? 'pt-3' : 'py-0'}`}>
          <DropDowns show={show} setShow={setShow} isSticky={isSticky} />

          {/* Navigation links  */}
          <div className='flex items-center'>
            {navItems.map((item: navItemType, index: number) => (
              <Link className='px-5 font-medium text-md' key={index} href={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
            {isSticky && (
              <div className='flex items-center gap-8'>
                {/* login  */}

                <div className='flex items-center gap-2'>
                  <Link
                    href={'/login'}
                    className={`border-2 flex justify-center items-center w-[50px] h-[50px] rounded-full border-primary-border`}
                  >
                    <ProfileIcon />
                  </Link>
                  <Link href={'/login'}>
                    <span className='block font-medium'>Hello, </span>
                    <span className='font-semibold'>Sign in </span>
                  </Link>
                </div>

                {/* wish list and cart  */}

                <div className='flex items-center gap-5'>
                  <Link href={'/wishlist'} className='relative cursor-pointer'>
                    <Heart />
                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                      <span className='text-white text-sm font-medium'>0</span>
                    </div>
                  </Link>
                  <Link href={'/cart'} className='relative cursor-pointer'>
                    <Handbag />
                    <div className='w-6 h-6 border-2 border-white bg-red-500 rounded-full flex items-center justify-center absolute top-[-10px] right-[-10px]'>
                      <span className='text-white text-sm font-medium'>0</span>
                    </div>
                  </Link>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default HeaderBottom;
