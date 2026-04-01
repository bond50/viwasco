// components/seo/JsonLd.tsx

type JsonLdProps = { data: Record<string, unknown> };

function safeJson(data: unknown) {
  // Prevent </script> early-termination and special chars
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(data) }} />;
}
