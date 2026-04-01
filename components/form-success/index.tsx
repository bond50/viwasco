'use client';
import { BsCheckCircle } from 'react-icons/bs';

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;

  return (
    <div
      className="alert alert-success d-flex align-items-start gap-2 p-3 rounded-2 shadow-sm small"
      role="alert"
      style={{
        backgroundColor: '#d1e7dd',
        border: 'none',
        color: '#197738',
      }}
    >
      <BsCheckCircle size={20} className="mt-1" />
      <div>{message}</div>
    </div>
  );
};
