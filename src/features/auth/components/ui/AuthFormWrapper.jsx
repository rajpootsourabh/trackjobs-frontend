import React from 'react';

const AuthFormWrapper = ({ children, isRegister = false }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-300 shadow-[12px_8px_0px_#D9D9D9] ${
      isRegister ? 'p-6 max-w-[481px]' : 'p-8 max-w-[548px]'
    } w-full`}>
      {children}
    </div>
  );
};

export default AuthFormWrapper;