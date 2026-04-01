import React from 'react';

export const Footer = () => {
  return (
    <footer id="admin-footer" className="footer">
      <div className="copyright">
        &copy; Copyright{' '}
        <strong>
          <span>{process.env.NEXT_PUBLIC_COMPANY_SHORTNAME}</span>
        </strong>
        . All Rights Reserved
      </div>
    </footer>
  );
};
