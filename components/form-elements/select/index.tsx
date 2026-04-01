'use client';

import dynamic from 'next/dynamic';

export type { SelectComponentProps, GenericOption } from './types';

// Use the *type of the value export* from client
type ClientSelectType = typeof import('./client').Select;

const SelectDynamic = dynamic(() => import('./client').then((m) => m.Select), {
  ssr: false,
  loading: () => <div className="text-muted">Loading select…</div>,
}) as unknown as ClientSelectType;

export const Select = SelectDynamic;
