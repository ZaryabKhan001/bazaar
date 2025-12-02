import React from 'react';

const GoogleButton = () => {
  return (
    <div className='flex justify-center items-center cursor-pointer'>
      <div className='bg-primary-backgroundDull rounded-md flex justify-center items-center gap-3 w-fit px-4 py-2'>
        <svg viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' width='22' height='22'>
          {/* Hidden path */}
          <path d='M8.9 16c0 .6.1 1.2.2 1.8L11 16l-1.8-1.8c-.2.6-.3 1.2-.3 1.8z' fill='none' />

          {/* Green */}
          <path
            d='M16 23.1c-3.3 0-6-2.2-6.8-5.2l-6.7 6.7C5.3 29 10.3 32 16 32c3.1 0 6-.9 8.5-2.5l-6.7-6.7c-.6.2-1.2.3-1.8.3z'
            fill='#34A853'
          />

          {/* Blue */}
          <path
            d='M32 13.8c-.1-.5-.5-.8-1-.8H16c-.6 0-1 .4-1 1v5c0 .6.4 1 1 1h5.3c-.9 1.4-2.2 2.3-3.5 2.8l6.7 6.7C29 26.7 32 21.7 32 16c0-.3 0-.5 0-.7-.1-.4-.1-.9-.2-1.5z'
            fill='#4285F4'
          />

          {/* Yellow */}
          <path
            d='M8.9 16c0-.6.1-1.2.2-1.8L2.5 7.5C.9 10 0 12.9 0 16s.9 6 2.5 8.5l6.7-6.7c-.1-.6-.3-1.2-.3-1.8z'
            fill='#FBBC05'
          />

          {/* Red */}
          <path
            d='M28.5 6c-1.1-1.4-2.5-2.6-4-3.6C22 .9 19.1 0 16 0 10.3 0 5.3 3 2.5 7.5l6.7 6.7c.8-3 3.6-5.2 6.8-5.2.6 0 1.2.1 1.8.3.9.3 1.7.8 2.6 1.5.3.3.7.3 1.1.1l6.7-3.3c.3-.1.5-.4.5-.7-.1-.3-.2-.6-.4-.9z'
            fill='#EA4335'
          />
        </svg>
        <span className='font-normal'>Sign In with Google</span>
      </div>
    </div>
  );
};

export default GoogleButton;
