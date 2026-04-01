import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { generatePageMetadata, PageSeo } from '@/components/seo/page-seo';
import { SITE } from '@/lib/seo/config';
import { Breadcrumb } from '@/components/reusables/breadcrumb';
import { toUiBreadcrumbs } from '@/lib/seo/breadcrumb-utils';
import { getLeadershipMessageBySlug } from '@/lib/data/public/about/getters';
import { MessageArticle } from '@/components/public/about/message-article';
import { MessageAuthorCard } from '@/components/public/about/message-author-card';
import { Section } from '@/components/reusables/sections/section';

type PageParams = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const msg = await getLeadershipMessageBySlug(slug);

  if (!msg) {
    const title = `Leadership message not found | ${SITE.shortName}`;
    const description = 'The requested leadership message could not be found.';
    return generatePageMetadata({
      title,
      description,
      path: `/about/leadership/messages/${slug}`,
      type: 'article',
    });
  }

  const title = `${msg.title} | ${SITE.shortName}`;
  const description =
    msg.excerpt && msg.excerpt.length > 0
      ? msg.excerpt.length > 150
        ? `${msg.excerpt.slice(0, 147)}…`
        : msg.excerpt
      : undefined;

  return generatePageMetadata({
    title,
    description,
    path: `/about/leadership/messages/${msg.authorTeam.slug}`,
    type: 'article',
  });
}

async function LeadershipMessageDetailContent({ slug }: { slug: string }) {
  const msg = await getLeadershipMessageBySlug(slug);

  if (!msg) {
    notFound();
  }

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
    { name: 'Leadership Messages', item: '/about/leadership/messages' },
    {
      name: msg.authorTeam.name,
      item: `/about/leadership/messages/${msg.authorTeam.slug}`,
    },
  ];
  const breadcrumbLinks = toUiBreadcrumbs(breadcrumbItems);

  const uiMsg = {
    title: msg.title,
    body: msg.body,
    excerpt: msg.excerpt,
    updatedAt: msg.updatedAt,
    authorTeam: {
      name: msg.authorTeam.name,
      position: msg.authorTeam.position,
      slug: msg.authorTeam.slug,
    },
  };

  const persons = [
    {
      name: msg.authorTeam.name,
      url: `/about/leadership/team/${msg.authorTeam.slug}`,
      jobTitle: msg.authorTeam.position ?? undefined,
    },
  ];

  return (
    <>
      <PageSeo
        title={`${msg.title} | ${SITE.shortName}`}
        description={uiMsg.excerpt && uiMsg.excerpt.length > 0 ? uiMsg.excerpt : undefined}
        path={`/about/leadership/messages/${msg.authorTeam.slug}`}
        type="article"
        breadcrumbItems={breadcrumbItems}
        persons={persons}
      />

      <Breadcrumb pageTitle="Leadership Message" items={breadcrumbLinks} />

      <Section background="default" padding="lg">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <MessageArticle msg={uiMsg} />
            </div>
            <div className="col-lg-4">
              <MessageAuthorCard author={uiMsg.authorTeam} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

export default function LeadershipMessageDetailPage({ params }: PageParams) {
  return (
    <main className="pb-5">
      <Suspense fallback={<div className="p-6">Loading leadership message…</div>}>
        {params.then(({ slug }) => (
          <LeadershipMessageDetailContent slug={slug} />
        ))}
      </Suspense>
    </main>
  );
}
