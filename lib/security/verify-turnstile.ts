import 'server-only';

type CloudflareTurnstileResponse = {
  success: boolean;
  'error-codes'?: string[];
};

export type TurnstileVerificationResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
      errorCodes?: string[];
    };

export async function verifyTurnstileToken(
  token: string,
  remoteip?: string,
): Promise<TurnstileVerificationResult> {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return {
      success: false,
      message: 'Please complete the security check.',
    };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Missing TURNSTILE_SECRET_KEY');
    return {
      success: false,
      message: 'Security verification is not configured.',
    };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: normalizedToken,
    });

    if (remoteip?.trim()) {
      body.set('remoteip', remoteip.trim());
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        success: false,
        message: 'Security verification failed. Please try again.',
      };
    }

    const data = (await response.json()) as CloudflareTurnstileResponse;

    if (!data.success) {
      return {
        success: false,
        message: 'Security verification failed. Please try again.',
        errorCodes: data['error-codes'] ?? [],
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Turnstile verification error:', error);

    return {
      success: false,
      message: 'Security verification failed. Please try again.',
    };
  }
}
