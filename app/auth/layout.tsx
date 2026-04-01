import React, { ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="container">
      <section className="min-vh-100 d-flex flex-column align-items-center justify-content-center py-4 ">
        {children}
      </section>
    </div>
  );
};

export default AuthLayout;
