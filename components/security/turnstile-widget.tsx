'use client';

import { Turnstile } from '@marsidev/react-turnstile';

type TurnstileWidgetProps = {
  value: string;
  onChange: (token: string) => void;
  className?: string;
  hiddenInputName?: string;
};

export function TurnstileWidget({
  value,
  onChange,
  className,
  hiddenInputName = 'cf-turnstile-response',
}: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

  return (
    <>
      <input type="hidden" name={hiddenInputName} value={value} readOnly />

      <div className={className}>
        {siteKey ? (
          <Turnstile
            siteKey={siteKey}
            onSuccess={(token) => onChange(token)}
            onExpire={() => onChange('')}
            onError={() => onChange('')}
            options={{
              theme: 'auto',
              size: 'normal',
            }}
          />
        ) : (
          <div role="alert" className="alert alert-warning mb-0">
            Turnstile is not configured. Add <code>NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>.
          </div>
        )}
      </div>
    </>
  );
}
