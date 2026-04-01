import { FaExclamationTriangle } from 'react-icons/fa';
import CardWrapper from '@/components/card/card-wrapper';

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-100 d-flex justify-content-center align-items-center">
        <FaExclamationTriangle className="text-danger" size={32} />
      </div>
    </CardWrapper>
  );
};
