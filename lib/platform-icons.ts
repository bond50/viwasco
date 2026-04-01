// lib/platform-icons.ts
export const platformIconsMap: Record<string, string> = {
  facebook: 'FaFacebook',
  x: 'FaTwitter',
  instagram: 'FaInstagram',
  tiktok: 'FaTiktok',
  linkedin: 'FaLinkedin',
  threads: 'SiThreads',
};

export const getIconForPlatform = (platform: string): string => {
  return platformIconsMap[platform] || '';
};
