import { CategoryWithActiveMembers } from '@/lib/types/about/management';
import { pickBestVariant } from '@/lib/assets/core';
import { TeamCard } from '@/components/reusables/cards/team-card';
import styles from './leadership-team-section.module.css';

type LeadershipTeamSectionProps = {
  category: CategoryWithActiveMembers;
  index: number;
};

function categoryHeadingPrefix(type: CategoryWithActiveMembers['categoryType']): string {
  switch (type) {
    case 'BOARD':
      return 'Board';
    case 'EXECUTIVE':
      return 'Executive';
    case 'MANAGEMENT':
    default:
      return 'Management';
  }
}

export function LeadershipTeamSection({ category, index }: LeadershipTeamSectionProps) {
 const sectionClass = [
  styles.section,
  index % 2 === 0 ? styles.sectionAlt : '',
  'team-list',
]
  .filter(Boolean)
  .join(' ');


  return (
    <section className={sectionClass}>
      <div className="container">
        <div className={styles.sectionTitle}>
          <h2 className={styles.heading}>{categoryHeadingPrefix(category.categoryType)}</h2>
          <div className={styles.subTitleRow}>
            <span>Leadership · </span>
            <span className={styles.categoryName}>{category.name}</span>
          </div>
          {category.description && (
            <p className={styles.description}>{category.description}</p>
          )}
        </div>

        <div className="row g-4">
          {category.teamMembers.map((member, i) => {


            const best = pickBestVariant(member.image, ['square', 'medium', 'small', 'thumb']);
            const href = `/about/leadership/team/${member.slug}`;

            return (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={member.id}
                data-aos="fade-up"
                data-aos-delay={100 * (i + 1)}
              >
                <TeamCard
                  id={member.id}
                  slug={member.slug}
                  name={member.name}
                  position={member.position}
                  bio={member.bio}
                  imageUrl={best.secure_url || best.url}
                  blurDataURL={best.blurDataURL}
                  imageWidth={best.width}
                  imageHeight={best.height}
                  href={href}
                  category={{ name: category.name, slug: category.slug }}
                  isFeatured={member.isFeatured}
                  socialLinks={member.socialLinks}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
