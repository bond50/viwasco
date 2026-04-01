type Doc = {
  id: string;
  title: string;
  description?: string | null;
  file: unknown; // { url, ... } shape handled upstream
  category?: { name: string; slug: string } | null;
};

export function DocsList({ items }: { items: Doc[] }) {
  if (!items.length) return <p>No documents yet.</p>;
  return (
    <ul className="list-group">
      {items.map(d => (
        <li key={d.id} className="list-group-item">
          <div className="d-flex flex-column">
            <strong>{d.title}</strong>
            {d.category && <small className="text-muted">Category: {d.category.name}</small>}
            {d.description && <div className="mt-1">{d.description}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}
