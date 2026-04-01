// components/seo/events-jsonld.ts
export function eventsListJsonLd({
  url,
  items,
}: {
  url: string;
  items: { url: string; name: string; position: number }[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((i) => ({
        '@type': 'ListItem',
        position: i.position,
        name: i.name,
        url: i.url,
      })),
    },
    url,
  };
}

export function breadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.item,
    })),
  };
}
