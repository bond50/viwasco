'use client';
import styles from '@/components/auth/social/social.module.css';

import { cn } from '@/lib/utils';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { Button } from '@/components/form-elements/button';

const CLIENT_URL = process.env.NEXT_PUBLIC_CLIENT_URL ?? '';

function resolveLoginRedirect(target?: string | null) {
  const base = CLIENT_URL || window.location.origin;
  const fallback = new URL(DEFAULT_LOGIN_REDIRECT, base);

  if (!target) return fallback.toString();

  try {
    const url = new URL(target, base);
    const path = `${url.pathname}${url.search}${url.hash}`;
    return new URL(path, base).toString();
  } catch {
    return fallback.toString();
  }
}

type SocialProvider = 'google' | 'github';

interface SocialButtonProps {
  provider: SocialProvider;
  icon: React.ReactNode;
  label: string;
  onClick: (provider: SocialProvider) => void;
}

const SocialButton = ({ provider, icon, label, onClick }: SocialButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="small"
      className={cn(styles.socialButton, styles[provider])}
      onClick={() => onClick(provider)}
      aria-label={`Sign in with ${provider}`}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </Button>
  );
};

export const Social = () => {
  const handleSignIn = (provider: SocialProvider) => {
    void (async () => {
      const result = await signIn(provider, {
        redirect: false,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });

      window.location.replace(resolveLoginRedirect(result?.url));
    })();
  };

  return (
    <div className={styles.socialContainer}>
      <SocialButton
        provider="google"
        icon={<FcGoogle size={20} />}
        label="Continue with Google"
        onClick={handleSignIn}
      />
      <SocialButton
        provider="github"
        icon={<FaGithub size={20} />}
        label="Continue with GitHub"
        onClick={handleSignIn}
      />
    </div>
  );
};
