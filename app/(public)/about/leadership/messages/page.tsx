import type { Metadata } from 'next';
import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { getLeadershipMessages } from '@/lib/data/public/about/getters';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { Section } from '@/components/reusables/sections/section';
import { QuoteCard } from '@/components/public/about/quote-card';
import { pickImageUrl } from '@/lib/public/media';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Leadership Messages | ${SITE.shortName}`;
  const description =
    'Messages from the leadership team sharing priorities, direction, and updates.';
  return generatePageMetadata({
    title,
    description,
    path: '/about/leadership/messages',
    type: 'website',
  });
}

export default async function LeadershipMessagesPage() {
  const items = await getLeadershipMessages();

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Leadership Messages', item: '/about/leadership/messages' },
  ];

  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  return (
    <main>
      <PageSeo
        title={`Leadership Messages | ${SITE.shortName}`}
        description="Messages from the leadership team sharing priorities, direction, and updates."
        path="/about/leadership/messages"
        type="website"
        breadcrumbItems={breadcrumbItems}
      />

      <Breadcrumb pageTitle="Leadership Messages" items={breadcrumbLinks} />

      <Section background="default" padding="lg">
        <div className="container">
          <div className="section-title text-center mb-4">
            <h2>Leadership Messages</h2>
            <p className="text-muted">
              Hear directly from our leadership team about our mandate, priorities, and commitment
              to service.
            </p>
          </div>

          {!items.length && (
            <p className="text-muted text-center mb-0">
              No leadership messages have been published yet.
            </p>
          )}

          {items.length > 0 && (
            <div className="row g-4">
              {items.map((msg) => {
                const avatarUrl = msg.authorTeam ? pickImageUrl(msg.authorTeam.image) : null;

                const dateLabel = msg.updatedAt
                  ? new Date(msg.updatedAt).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : undefined;

                const short =
                  msg.excerpt && msg.excerpt.length > 0
                    ? msg.excerpt
                    : msg.body.length > 200
                      ? `${msg.body.slice(0, 197)}…`
                      : msg.body;

                const href = msg.authorTeam
                  ? `/about/leadership/messages/${msg.authorTeam.slug}`
                  : undefined;

                return (
                  <div key={msg.id} className="col-12 col-md-6 col-xl-4">
                    <QuoteCard
                      variant="message"
                      label="Leadership Message"
                      message={short}
                      name={msg.authorTeam?.name ?? 'Leadership'}
                      role={msg.authorTeam?.position ?? undefined}
                      avatarUrl={avatarUrl}
                      href={href}
                      dateLabel={dateLabel}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Section>
    </main>
  );
}
