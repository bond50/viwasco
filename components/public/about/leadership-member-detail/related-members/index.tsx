// components/public/about/leadership/related-members.tsx


import Link from 'next/link';
import { TeamCard } from '@/components/reusables/cards/team-card';
import { pickBestVariant } from '@/lib/assets/core';
import type { ActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';

interface RelatedMembersProps {
  related: ActiveTeamMemberWithRelated['related'];
  category: ActiveTeamMemberWithRelated['category'];
}

export function RelatedMembers({ related, category }: RelatedMembersProps) {
  if (related.length === 0) return null;

  return (
    <div className="col-12 mt-5">
      <div className="border-top pt-5">
        <h3 className="h4 mb-4">Other {category.name} Team Members</h3>
        <div className="row g-4">
          {related.map((relatedMember) => {
            const best = pickBestVariant(relatedMember.image, [
              'square',
              'medium',
              'small',
              'thumb',
            ]);

            return (
              <div key={relatedMember.id} className="col-sm-6 col-lg-4 col-xl-3">
                <TeamCard
                  id={relatedMember.id}
                  slug={relatedMember.slug}
                  name={relatedMember.name}
                  position={relatedMember.position}
                  bio={relatedMember.bio}
                  imageUrl={best.secure_url || best.url}
                  blurDataURL={best.blurDataURL}
                  imageWidth={best.width || undefined}
                  imageHeight={best.height || undefined}
                  href={`/about/leadership/team/${relatedMember.slug}`}
                  category={{ name: category.name, slug: category.slug }}
                  isFeatured={relatedMember.isFeatured}
                  socialLinks={[]}
                />
              </div>
            );
          })}
        </div>
        <div className="text-center mt-4">
          <Link href="/about/leadership/team" className="btn btn-outline-primary">
            View Complete Leadership Team
          </Link>
        </div>
      </div>
    </div>
  );
}