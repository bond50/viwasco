import { pickImageUrl } from '@/lib/public/media';
import Image from 'next/image';

type Org = {
  name: string;
  tagline?: string | null;
  description?: string | null;
  bannerImage?: unknown | null;
  logo?: unknown | null;
  websiteUrl?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  address?: string | null;
};

export function OverviewHero({ org }: { org: Org }) {
  const banner = pickImageUrl(org.bannerImage);
  const logo = pickImageUrl(org.logo);

  return (
    <section className="about-hero">
      {banner && (
        <div className="hero-banner mb-3">
          <Image
            src={banner}
            alt={`${org.name} banner`}
            width={1600}
            height={560}
            className="img-fluid w-100 rounded-3"
            sizes="100vw"
          />
        </div>
      )}
      <div className="d-flex align-items-start gap-3">
        {logo && (
          <Image
            src={logo}
            alt={`${org.name} logo`}
            width={72}
            height={72}
            className="rounded"
            style={{ objectFit: 'contain' }}
          />
        )}
        <div>
          <h1 className="h3 mb-1">{org.name}</h1>
          {org.tagline && <p className="lead mb-2">{org.tagline}</p>}
          {org.description && <p className="text-body">{org.description}</p>}
          <div className="small text-muted mt-2">
            {org.websiteUrl && <>🌐 <a href={org.websiteUrl} target="_blank" rel="noreferrer">{org.websiteUrl}</a><br/></>}
            {org.contactEmail && <>✉️ <a href={`mailto:${org.contactEmail}`}>{org.contactEmail}</a><br/></>}
            {org.phone && <>☎️ {org.phone}<br/></>}
            {org.address && <>📍 {org.address}</>}
          </div>
        </div>
      </div>
    </section>
  );
}
