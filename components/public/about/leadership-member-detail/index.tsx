import Link from 'next/link';
import { cn } from '@/lib/utils';

import { ContactLeaderForm } from '@/components/public/about/contact-leader-form';
import type { ActiveTeamMemberWithRelated } from '@/lib/data/public/about/getters';

import { MemberSidebar } from '@/components/public/about/leadership-member-detail/member-sidebar';
import { OfficeInfo } from '@/components/public/about/leadership-member-detail/office-info';
import { DirectContact } from '@/components/public/about/leadership-member-detail/direct-contact';

import { LeadershipMessage } from '@/components/public/about/leadership-member-detail/leadership-message';
import { RelatedMembers } from '@/components/public/about/leadership-member-detail/related-members';
import { BioSection } from '@/components/public/about/leadership-member-detail/bio-section';
import { ExperienceSection } from '@/components/public/about/leadership-member-detail/expirience-section';
import { EducationSection } from '@/components/public/about/leadership-member-detail/education-info';
import { AchievementsSection } from '@/components/public/about/leadership-member-detail/achievements-section.tsx';
import { PublicationsSection } from '@/components/public/about/leadership-member-detail/publications-section';
import { ListsSection } from '@/components/public/about/leadership-member-detail/list-section';

import { computeLeadershipVisibility } from '@/lib/about/leadership/visibility';

import styles from '@/components/public/about/leadership-member-detail/leadership-member-detail.module.css';

type ActiveTab = 'overview' | 'career' | 'publications' | 'background' | 'contact';

interface LeadershipMemberDetailProps {
  member: ActiveTeamMemberWithRelated['member'];
  category: ActiveTeamMemberWithRelated['category'];
  related: ActiveTeamMemberWithRelated['related'];
  message: ActiveTeamMemberWithRelated['message'];
  activeTab: ActiveTab;
}

export function LeadershipMemberDetail({
  member,
  category,
  related,
  message,
  activeTab,
}: LeadershipMemberDetailProps) {

  // Use the visibility utility to compute all visibility states
  const visibility = computeLeadershipVisibility(member, message);

  const firstName = member.name.split(' ')[0] ?? member.name;

  return (
    <div className="row">
      {/* Sidebar — profile card on the left */}
      <div className="col-lg-3 mb-5 mb-lg-0">
        <MemberSidebar member={member} category={category} />
      </div>

      {/* Main Content */}
      <div className="col-lg-9">
        {/* Top tab strip (NiceAdmin-style, URL-based) */}
        <div className={styles.tabsRow}>
          <ul className={cn('nav', styles.navTabsBordered)}>
            {visibility.hasOverview && (
              <li className={styles.tabItem}>
                <Link
                  href={`/about/leadership/team/${member.slug}?tab=overview`}
                  scroll={false}
                  className={cn(
                    styles.tabLink,
                    activeTab === 'overview' && styles.tabLinkActive,
                  )}
                >
                  Overview
                </Link>
              </li>
            )}

            {visibility.hasCareer && (
              <li className={styles.tabItem}>
                <Link
                  href={`/about/leadership/team/${member.slug}?tab=career`}
                  scroll={false}
                  className={cn(
                    styles.tabLink,
                    activeTab === 'career' && styles.tabLinkActive,
                  )}
                >
                  Career &amp; Experience
                </Link>
              </li>
            )}

            {visibility.hasPublications && (
              <li className={styles.tabItem}>
                <Link
                  href={`/about/leadership/team/${member.slug}?tab=publications`}
                  scroll={false}
                  className={cn(
                    styles.tabLink,
                    activeTab === 'publications' && styles.tabLinkActive,
                  )}
                >
                  Publications
                </Link>
              </li>
            )}

            {visibility.hasBackground && (
              <li className={styles.tabItem}>
                <Link
                  href={`/about/leadership/team/${member.slug}?tab=background`}
                  scroll={false}
                  className={cn(
                    styles.tabLink,
                    activeTab === 'background' && styles.tabLinkActive,
                  )}
                >
                  Professional Details
                </Link>
              </li>
            )}

            {member.allowContact && (
              <li className={styles.tabItem}>
                <Link
                  href={`/about/leadership/team/${member.slug}?tab=contact`}
                  scroll={false}
                  className={cn(
                    styles.tabLink,
                    activeTab === 'contact' && styles.tabLinkActive,
                  )}
                >
                  Contact {firstName}
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className={styles.tabContentWrapper}>
          {/* OVERVIEW TAB: messages + bio first, nothing "utility" here */}
          {activeTab === 'overview' && (
            <div className="ps-lg-4">
              {message && (
                <LeadershipMessage
                  message={message}
                  leaderName={member.name}
                />
              )}

              {visibility.showBio && member.bio && (
                <BioSection bio={member.bio} showBio={visibility.showBio} />
              )}

              {!message && (!member.bio || !visibility.showBio) && (
                <p className="text-muted">No overview information available.</p>
              )}
            </div>
          )}

          {/* CAREER TAB: education + experience + achievements */}
                   {/* CAREER TAB: experience + education + achievements */}
          {activeTab === 'career' && (
            <div className="ps-lg-4">
              {visibility.hasCareer ? (
                <>
                  {/* Top row: Experience (wider) + Education (narrower) */}
                  <div className="row g-4 align-items-start mb-4">
                    <div className="col-12 col-lg-7">
                      <ExperienceSection
                        experienceItems={visibility.experienceItems}
                        showExperience={visibility.showExperience}
                      />
                    </div>
                    <div className="col-12 col-lg-5">
                      <EducationSection
                        educationItems={visibility.educationItems}
                        showEducation={visibility.showEducation}
                      />
                    </div>
                  </div>

                  {/* Second row: Achievements full width */}
                  <div className="row g-4">
                    <div className="col-12">
                      <AchievementsSection
                        achievementItems={visibility.achievementItems}
                        showAchievements={visibility.showAchievements}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted">No career details available.</p>
              )}
            </div>
          )}


          {/* PUBLICATIONS TAB */}
          {activeTab === 'publications' && (
            <div className="ps-lg-4">
              {visibility.hasPublications ? (
                <PublicationsSection
                  publicationItems={visibility.publicationItems}
                  showPublications={visibility.showPublications}
                />
              ) : (
                <p className="text-muted">No publications available.</p>
              )}
            </div>
          )}

          {/* PROFESSIONAL DETAILS TAB:
              Office info + lists (languages, committees, awards…) */}
          {activeTab === 'background' && (
            <div className="ps-lg-4">
              {visibility.hasOfficeInfo && (
                <OfficeInfo
                  officeLocation={member.officeLocation}
                  officeHours={member.officeHours}
                  assistantContact={member.assistantContact}
                  showWorkingHours={visibility.showWorkingHours}
                />
              )}

              {visibility.hasLists && (
                <ListsSection
                  languages={visibility.languages}
                  boardCommittees={visibility.boardCommittees}
                  professionalAffiliations={visibility.professionalAffiliations}
                  awards={visibility.awards}
                  showLists={visibility.showLists}
                />
              )}

              {!visibility.hasOfficeInfo && !visibility.hasLists && (
                <p className="text-muted">No additional professional details available.</p>
              )}
            </div>
          )}

          {/* CONTACT TAB: direct contact + form in one place */}
          {activeTab === 'contact' && member.allowContact && (
            <div className="ps-lg-4">
              {visibility.showDirectContact && (
                <DirectContact
                  showEmail={member.showEmail}
                  email={member.email}
                  showPhone={member.showPhone}
                  phone={member.phone}
                />
              )}

              <ContactLeaderForm
                leaderId={member.id}
                leaderName={member.name}
                leaderPosition={member.position}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Team Members */}
      <RelatedMembers related={related} category={category} />
    </div>
  );
}