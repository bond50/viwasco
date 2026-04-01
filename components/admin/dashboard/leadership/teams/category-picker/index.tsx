'use client';

import { useRouter } from 'next/navigation';
import { Select } from '@/components/form-elements/select/client'; // <-- keeps generics
import type { GenericOption } from '@/components/form-elements/select/types';
import type { OnChangeValue } from 'react-select';

type Option = { id: string; name: string };
type Opt = GenericOption<string>;

export default function CategoryPicker({
  options,
  selectedId,
}: {
  options: Option[];
  selectedId: string;
}) {
  const router = useRouter();
  const opts: Opt[] = options.map((o) => ({ value: o.id, label: o.name }));
  const selected = opts.find((o) => o.value === selectedId) ?? opts[0];

  const handleChange = (newValue: OnChangeValue<Opt, false>) => {
    const chosen = Array.isArray(newValue) ? newValue[0] : newValue;
    const id = chosen?.value ?? selected?.value ?? '';
    const u = new URL(window.location.href);
    u.searchParams.set('categoryId', id);
    router.push(u.toString());
  };

  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <Select
        name="categoryIdView"
        label="Category"
        placeholder="Filter by category"
        options={opts}
        defaultValue={selected}
        onChange={handleChange}
        className="flex-grow-1"
      />
    </div>
  );
}
