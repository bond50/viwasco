import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to conditionally combine class names in Bootstrap projects.
 * Since Bootstrap doesn't have conflicting utilities like Tailwind, `clsx` is enough.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}

//isValidUrl.ts
/**
 * Validates a URL string against common criteria.
 * @param url The URL to validate.
 * @param options Optional validation rules.
 * @returns boolean indicating if the URL is valid.
 */
export const isValidUrl = (
  url: string,
  options?: {
    protocols?: string[];
    requireProtocol?: boolean;
    allowLocal?: boolean;
  },
): boolean => {
  if (!url) return false;

  const {
    protocols = ['http', 'https'],
    requireProtocol = true,
    allowLocal = false,
  } = options || {};

  // Must start with a protocol if required
  if (requireProtocol && !/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url)) {
    return false;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  // Ensure protocol is among the accepted ones
  const protocol = parsed.protocol.replace(':', '');
  if (!protocols.includes(protocol)) {
    return false;
  }

  const hostname = parsed.hostname;

  // Optionally disallow local/loopback addresses
  if (!allowLocal) {
    const isLocalhost =
      hostname === 'localhost' || hostname.endsWith('.localhost') || hostname === '[::1]';
    const isPrivateIP =
      /^127\./.test(hostname) || // 127.0.0.0/8 loopback
      /^10\./.test(hostname) || // 10.0.0.0/8 private
      /^192\.168\./.test(hostname) || // 192.168.0.0/16 private
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname); // 172.16.0.0 – 172.31.255.255

    if (isLocalhost || isPrivateIP) {
      return false;
    }
  }

  // Ensure hostname has at least one dot (e.g., example.com)
  if (!hostname.includes('.') && hostname !== 'localhost') {
    return false;
  }

  // Optional: Validate TLD exists (basic check)
  // const tld = hostname.split('.').pop();
  // if (!tld || tld.length < 2) return false;

  return true;
};
