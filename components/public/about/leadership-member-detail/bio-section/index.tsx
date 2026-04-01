import { RichContent } from '@/components/reusables/rich-text/HtmlContent';
import classes from '@/components/public/about/leadership-member-detail/leadership-member-detail.module.css';

interface BioSectionProps {
  bio: string;
  showBio: boolean;
}

export function BioSection({ bio, showBio }: BioSectionProps) {
  if (!showBio || !bio) return null;

  return (
    <section className={classes.leaderShipWrapper}>
      <h3 className={classes.leaderShipHeading}>Biography</h3>
      <div data-aos="fade-up">
        <RichContent
          html={bio}
          className=""
          imageSizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 85vw,
                     800px"
          badge={<span className="badge bg-primary">Biography</span>}
        />
      </div>
    </section>
  );
}
