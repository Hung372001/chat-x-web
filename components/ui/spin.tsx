import React from 'react';

export default function Spin({
  children,
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading ? (
        <div className='mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/25 border-b-white'></div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
