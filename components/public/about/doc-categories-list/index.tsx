type Cat = { id: string; name: string; slug: string };

export function DocCategoriesList({ items }: { items: Cat[] }) {
  if (!items.length) return null;
  return (
    <ul className="list-inline">
      {items.map(c => (
        <li key={c.id} className="list-inline-item me-2 mb-2">
          <a className="btn btn-sm btn-outline-secondary" href={`/about/documents/categories/${encodeURIComponent(c.slug)}`}>
            {c.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
