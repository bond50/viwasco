export function projectsListJsonLd(params: {
  url: string;
  items: Array<{ url: string; name: string; position: number }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: params.items.map((it) => ({
      '@type': 'ListItem',
      position: it.position,
      url: it.url,
      name: it.name,
    })),
  };
}

export type ProjectDetailLdInput = {
  url: string;
  name: string;
  description?: string;
  image?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  location?: string;
  status?: string; // enum string
};

type SchemaPlace = { '@type': 'Place'; name: string };
type SchemaPropertyValue = {
  '@type': 'PropertyValue';
  name: string;
  value: string;
};

type ProjectLd = {
  '@context': 'https://schema.org';
  '@type': 'Project';
  url: string;
  name: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  location?: SchemaPlace;
  additionalProperty?: SchemaPropertyValue[];
};

export function projectDetailJsonLd(input: ProjectDetailLdInput): ProjectLd {
  const ld: ProjectLd = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    url: input.url,
    name: input.name,
  };

  if (input.description) ld.description = input.description;
  if (input.image) ld.image = input.image;
  if (input.startDate) ld.startDate = input.startDate;
  if (input.endDate) ld.endDate = input.endDate;
  if (input.location) ld.location = { '@type': 'Place', name: input.location };
  if (input.status) {
    ld.additionalProperty = [{ '@type': 'PropertyValue', name: 'status', value: input.status }];
  }

  return ld;
}
