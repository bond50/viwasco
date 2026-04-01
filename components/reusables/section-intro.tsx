export function SectionIntro({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? 'page-section-intro'} data-aos="fade-up">
      <h2 className="page-section-title">{title}</h2>
      {children}
    </div>
  );
}
