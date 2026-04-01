type Cat = { id: string; name: string; slug: string; description?: string | null; categoryType?: string };

export function CategoriesList({ items }: { items: Cat[] }) {
  if (!items.length) return <p>No leadership categories yet.</p>;
  return (
    <ul className="list-group">
      {items.map(c => (
        <li key={c.id} className="list-group-item d-flex flex-column">
          <div>
            <strong>{c.name}</strong>{c.categoryType ? <span className="text-muted"> — {c.categoryType}</span> : null}
          </div>
          {c.description && <small className="text-muted">{c.description}</small>}
        </li>
      ))}
    </ul>
  );
}
