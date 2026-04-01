// components/public/about/vision-mission/vision-mission.tsx
import React from 'react';
import styles from './vision-mission.module.css';
import { cn } from '@/lib/utils';

import { DynamicIcon } from '@/components/icons/DynamicIcon';
import { TbTargetArrow } from 'react-icons/tb';
import { MdOutlineVisibility } from 'react-icons/md';

import { getOrganizationOverview } from '@/lib/data/public/about/getters';

type VisionMissionDetails = {
  vision: string | null;
  mission: string | null;
  visionIcon: string | null;
  missionIcon: string | null;
};

type ViewProps = {
  details: VisionMissionDetails | null;
};

/**
 * PURE UI — no fetching here.
 */
function VisionMissionView({ details }: ViewProps) {
  if (!details) return null;

  return (
    <section className={cn('section', 'default-background', styles['vision-mission'])}>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          {/* Mission */}
          {!!details.mission && (
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div className={styles['mission-card']}>
                <div className={styles['icon-box']}>
                  <DynamicIcon
                    iconKey={details.missionIcon ?? undefined}
                    size={28}
                    fallback={<TbTargetArrow aria-hidden />}
                    title="Mission icon"
                  />
                </div>
                <h3>Our Mission</h3>
                <p>{details.mission}</p>
              </div>
            </div>
          )}

          {/* Vision */}
          {!!details.vision && (
            <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div className={styles['mission-card']}>
                <div className={styles['icon-box']}>
                  <DynamicIcon
                    iconKey={details.visionIcon ?? undefined}
                    size={28}
                    fallback={<MdOutlineVisibility aria-hidden />}
                    title="Vision icon"
                  />
                </div>
                <h3>Our Vision</h3>
                <p>{details.vision}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ SELF-FETCHING SERVER COMPONENT
 * Use under Suspense anywhere:
 *   <Suspense fallback={<VisionMissionSkeleton />}>
 *     <VisionMission />
 *   </Suspense>
 */
export async function VisionMission() {
  const org = await getOrganizationOverview();
  if (!org) return null;

  const hasAny = !!org.mission || !!org.vision;
  if (!hasAny) return null;

  const details: VisionMissionDetails = {
    mission: org.mission ?? null,
    vision: org.vision ?? null,
    missionIcon: org.missionIcon ?? null,
    visionIcon: org.visionIcon ?? null,
  };

  return <VisionMissionView details={details} />;
}
