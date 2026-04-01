// components/public/about/partners/partners-strip.tsx
import React from 'react';
import { getPartners } from '@/lib/data/public/about/getters';
import { PartnerPreview, PartnersStripClient } from '@/components/public/about/partners/partners-strip.client';
import { ensureUploadedImage } from '@/lib/assets/core';


export async function PartnersStripSection() {
  const partners = await getPartners();
  if (!partners.length) return null;

  const normalized: PartnerPreview[] = partners.map((p) => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  logo: ensureUploadedImage(p.logo),       // ← CHANGED: JsonValue -> UploadedImageResponse|null
  isActive: p.isActive,
  partnershipType: p.partnershipType,
}));

  return <PartnersStripClient partners={normalized} />;
}
