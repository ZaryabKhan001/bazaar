import Link from 'next/link';
import React from 'react';
import { Heart, Search, Handbag } from 'lucide-react';
import ProfileIcon from '../../assets/svgs/ProfileIcon';
import HeaderBottom from './HeaderBottom';

const Header = () => {
  return (
    <div className='w-full bg-white'>
      {/* top header */}
      <div className='max-w-[1400px] pl-4 pr-4 mx-auto'>
        <div className='py-5 m-auto flex items-center justify-between'>
          {/* logo  */}

          <div>
            <Link href={'/'}>
              <span className='text-3xl font-[600] font-Poppins'>Bazaar</span>
            </Link>
          </div>

          {/* search bar */}

          <div className='w-[50%] relative'>
            <input
              type='text'
              name='search-products'
              id='search-products'
              placeholder='Search for Products...'
              className={`w-full px-4 font-Poppins font-medium border-[2.5px] border-primary-main outline-none h-[45px]`}
            />
            <div
              className={`w-[60px] cursor-pointer flex items-center justify-center h-[45px] bg-primary-main absolute top-0 right-0`}
            >
              <Search color={`#fff`} />
            </div>
          </div>

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
        </div>
      </div>
      {/* header bottom  */}
      <div className='border-b border-b-slate-300' />
        <HeaderBottom />
    </div>
  );
};

export default Header;
