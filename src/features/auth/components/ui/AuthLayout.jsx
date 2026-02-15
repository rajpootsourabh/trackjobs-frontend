import React from 'react';
import { APP_NAME } from '../../../../utils/constants';

const AuthLayout = ({ children, title, isRegister = false }) => {
  return (
    <div className="min-h-screen bg-[#3574BB] flex flex-col items-center justify-center p-4 font-poppins relative">
      <div className="absolute inset-0 bg-primary-900 mix-blend-color z-0"></div>

      <h1 className="text-4xl font-semibold text-white mb-8 relative z-10">
        {APP_NAME}
      </h1>

      <div className={`relative z-10 w-full max-w-md bg-white rounded-lg shadow-[12px_8px_0px_#D9D9D9] ${isRegister ? 'p-6' : 'p-8'
        }`}>
        <div className="text-center mb-6">
          <h2 className={`font-semibold text-[#133956] ${isRegister ? 'text-3xl' : 'text-4xl'
            } uppercase`}>
            {title}
          </h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AuthLayout;