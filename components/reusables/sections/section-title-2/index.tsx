import styles from "./SectionTitle.module.css";

type Align = "center" | "left";
type Size = "sm" | "md" | "lg";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  align?: Align;
  underline?: boolean;
  size?: Size;
  className?: string;
};

export default function SectionTitle2({
  title,
  subtitle,
  align = "center",
  underline = true,
  size = "md",
  className = "",
}: SectionTitleProps) {
  return (
    <div
      className={`
        ${styles.sectionTitle}
        ${styles[align]}
        ${styles[size]}
        ${className}
      `}
    >
      <h2 className={underline ? styles.underline : ""}>{title}</h2>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}