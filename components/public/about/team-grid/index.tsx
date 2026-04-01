import { ensureUploadedImage, getBestImageUrl } from '@/lib/assets/core';
import Image from 'next/image';

type TeamItem = {
  id: string;
  name: string;
  position: string;
  bio?: string | null;
  image?: unknown | null;
  slug: string;
  category?: { name: string; slug: string };
  isFeatured?: boolean | null;
};

export function TeamGrid({ items }: { items: TeamItem[] }) {
  if (!items.length) return <p>No leaders yet.</p>;

  return (
    <div className="row g-3">
      {items.map((m) => {
        const imgAsset = ensureUploadedImage(m.image);
        const imgUrl = getBestImageUrl(imgAsset, ['card', 'medium', 'small', 'thumb']);

        return (
          <div key={m.id} className="col-12 col-sm-6 col-lg-4">
            <article className="card h-100 shadow-sm">
              {imgUrl && (
                <Image
                  src={imgUrl}
                  alt={m.name}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: 180 }}
                />
              )}
              <div className="card-body">
                <h3 className="h6 mb-1">{m.name}</h3>
                <div className="text-muted small">
                  {m.position}
                  {m.category ? ` · ${m.category.name}` : ''}
                </div>
                {m.bio && <p className="mt-2 mb-0">{m.bio}</p>}
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
