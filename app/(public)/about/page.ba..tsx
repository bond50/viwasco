// app/(public)/about/page.tsx
import type { Metadata } from 'next';

import { OverviewHero } from '@/components/public/about/overview-hero';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { pickImageUrl } from '@/lib/public/media';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import {
  getLeadershipMessage,
  getMetrics,
  getOrganizationOverview,
} from '@/lib/data/public/about/getters';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { workingHoursTopbarLabel } from '@/lib/working-hours';

// ---- Metadata ----
export async function generateMetadata(): Promise<Metadata> {
  const org = await getOrganizationOverview();

  const title = org?.shortName ? `About ${org.shortName}` : `About ${SITE.shortName}`;
  const description = org?.description || SITE.description;
  const heroImage = pickImageUrl(org?.bannerImage ?? org?.featuredImage) ?? SITE.defaultOg;

  return generatePageMetadata({
    title,
    description,
    path: '/about',
    image: heroImage,
    type: 'website',
  });
}

// ---- Page ----
export default async function AboutOverviewPage() {
  const org = await getOrganizationOverview();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ];

  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  // Fallback when no organization has been configured yet
  if (!org) {
    const fallbackTitle = `About ${SITE.shortName}`;
    return (
      <main className="container py-4 py-md-5">
        <PageSeo
          title={fallbackTitle}
          description={SITE.description}
          path="/about"
          type="website"
          showOrganization
          breadcrumbItems={breadcrumbItems}
          aboutPageProps={{
            title: fallbackTitle,
            description: SITE.description,
            url: '/about',
          }}
        />

        <Breadcrumb pageTitle={fallbackTitle} items={breadcrumbLinks} />

        <section className="py-5 text-center">
          <h1 className="h3 mb-2">About</h1>
          <p className="text-muted mb-0">
            Organization details are not available yet. Please check again later.
          </p>
        </section>
      </main>
    );
  }

  // When org exists → pull in richer context
  const heroImage = pickImageUrl(org.bannerImage ?? org.featuredImage) ?? undefined;
  const pageTitle = org.shortName ? `About ${org.shortName}` : `About ${org.name}`;
  const pageDescription = org.description || SITE.description;

  const workingHoursLabel = org.workingHours ? workingHoursTopbarLabel(org.workingHours) : null;

  const [metrics, leadershipMessage] = await Promise.all([getMetrics(), getLeadershipMessage()]);

  const hasMetrics = metrics.length > 0;

  return (
    <main className="container py-4 py-md-5">
      <PageSeo
        title={pageTitle}
        description={pageDescription}
        path="/about"
        image={heroImage}
        type="website"
        showOrganization
        breadcrumbItems={breadcrumbItems}
        aboutPageProps={{
          title: pageTitle,
          description: pageDescription,
          url: '/about',
        }}
      />

      <Breadcrumb pageTitle={pageTitle} items={breadcrumbLinks} />

      {/* Hero: banner / key highlight */}
      <OverviewHero org={org} />

      {/* Main overview content */}
      <section className="section default-background mt-4">
        <div className="row g-4">
          {/* Left: Who we are + mission / vision */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <span className="badge rounded-pill bg-primary-subtle text-primary-emphasis text-uppercase small fw-semibold mb-2">
                  About the utility
                </span>

                <h2 className="h4 mb-3">{org.introTitle || `Who we are`}</h2>

                <p className="mb-3 text-muted">
                  {org.introDescription || org.description || SITE.description}
                </p>

                {(org.vision || org.mission) && (
                  <div className="row g-3 mt-1">
                    {org.vision && (
                      <div className="col-md-6">
                        <h3 className="h6 text-uppercase text-muted mb-1">Our Vision</h3>
                        <p className="small mb-0">{org.vision}</p>
                      </div>
                    )}

                    {org.mission && (
                      <div className="col-md-6">
                        <h3 className="h6 text-uppercase text-muted mb-1">Our Mission</h3>
                        <p className="small mb-0">{org.mission}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: At a glance / quick facts */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h6 text-uppercase text-muted mb-3">At a glance</h2>

                <ul className="list-unstyled small mb-0">
                  {org.regulatorName && (
                    <li className="mb-2">
                      <span className="fw-semibold">Regulator: </span>
                      <span>{org.regulatorName}</span>
                    </li>
                  )}

                  {(org.licenseNumber || org.licenseExpiry) && (
                    <li className="mb-2">
                      <span className="fw-semibold">License: </span>
                      <span>
                        {org.licenseNumber && <>{org.licenseNumber}</>}
                        {org.licenseNumber && org.licenseExpiry && ' · '}
                        {org.licenseExpiry && (
                          <>
                            Expires{' '}
                            {new Date(org.licenseExpiry).toLocaleDateString('en-KE', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                            })}
                          </>
                        )}
                      </span>
                    </li>
                  )}

                  {workingHoursLabel && (
                    <li className="mb-2">
                      <span className="fw-semibold">Working hours: </span>
                      <span>{workingHoursLabel}</span>
                    </li>
                  )}

                  {org.customerCareHotline && (
                    <li className="mb-2">
                      <span className="fw-semibold">Customer care: </span>
                      <span>{org.customerCareHotline}</span>
                    </li>
                  )}

                  {org.whatsappNumber && (
                    <li className="mb-2">
                      <span className="fw-semibold">WhatsApp: </span>
                      <span>{org.whatsappNumber}</span>
                    </li>
                  )}

                  {org.phone && (
                    <li className="mb-2">
                      <span className="fw-semibold">Phone: </span>
                      <span>{org.phone}</span>
                    </li>
                  )}

                  {org.contactEmail && (
                    <li className="mb-2">
                      <span className="fw-semibold">Email: </span>
                      <a href={`mailto:${org.contactEmail}`} className="text-decoration-none">
                        {org.contactEmail}
                      </a>
                    </li>
                  )}

                  {org.websiteUrl && (
                    <li className="mb-2">
                      <span className="fw-semibold">Website: </span>
                      <a
                        href={org.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none"
                      >
                        {org.websiteUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </li>
                  )}

                  {org.address && (
                    <li className="mb-0">
                      <span className="fw-semibold">Address: </span>
                      <span>{org.address}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics preview */}
        {hasMetrics && (
          <section className="mt-4">
            <h2 className="h5 mb-3">Service in numbers</h2>
            <div className="row g-3">
              {metrics.slice(0, 4).map((m) => (
                <div className="col-6 col-md-3" key={m.id}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body py-3">
                      <div className="h4 mb-1">
                        {m.value}
                        {m.unit && <span className="small text-muted ms-1">{m.unit}</span>}
                      </div>
                      <div className="small text-muted">{m.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leadership message highlight */}
        {leadershipMessage && (
          <section className="mt-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-uppercase text-muted mb-2">From our leadership</h2>
                <h3 className="h5 mb-2">{leadershipMessage.title}</h3>
                <p className="mb-3 text-muted">{leadershipMessage.excerpt}</p>

                {leadershipMessage.authorTeam && (
                  <div className="small text-muted">
                    {leadershipMessage.authorTeam.name}
                    {leadershipMessage.authorTeam.position
                      ? `, ${leadershipMessage.authorTeam.position}`
                      : null}
                  </div>
                )}

                <a href="/about/leadership" className="btn btn-sm btn-outline-primary mt-3">
                  View leadership
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Quick links to other About sections */}
        <section className="mt-4">
          <h2 className="h6 text-uppercase text-muted mb-2">Explore more about us</h2>
          <div className="d-flex flex-wrap gap-2">
            <a href="/about/leadership" className="btn btn-sm btn-outline-secondary">
              Leadership
            </a>
            <a href="/about/values" className="btn btn-sm btn-outline-secondary">
              Core values
            </a>
            <a href="/about/awards" className="btn btn-sm btn-outline-secondary">
              Awards
            </a>
            <a href="/about/certifications" className="btn btn-sm btn-outline-secondary">
              Certifications
            </a>
            <a href="/about/partners" className="btn btn-sm btn-outline-secondary">
              Partners
            </a>
            <a href="/about/documents" className="btn btn-sm btn-outline-secondary">
              Key documents
            </a>
            <a href="/about/faqs" className="btn btn-sm btn-outline-secondary">
              FAQs
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}
