interface RenderHTMLProps {
  html: string;
  className?: string;
}

/**
 * Renders raw HTML string (e.g., with <p> tags) as real DOM content.
 * Make sure the HTML is sanitized before storing or rendering.
 */
export function RenderHTML({ html, className }: RenderHTMLProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
