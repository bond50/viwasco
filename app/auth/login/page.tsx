import { LoginForm } from '@/components/auth/login-form';

const DISABLE_RATE_LIMITS = true; // TODO: re-enable when done testing

const Page = async () => {
  return (
    <div data-rate-limits-disabled={DISABLE_RATE_LIMITS ? 'true' : undefined}>
      <LoginForm />
    </div>
  );
};

export default Page;
