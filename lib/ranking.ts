// lib/ranking.ts
import { db } from '@/lib/db';
import type { Prisma } from '@/generated/prisma/client';

// A utility type for the names of our Prisma models
type ModelName = Exclude<keyof typeof db, `$${string}` | symbol>;

// A utility type for the arguments of a specific action on a model
type ModelActionArgs<
  T extends ModelName,
  A extends 'aggregate' | 'updateMany' | 'update',
> = Prisma.Args<(typeof db)[T], A>;

// A utility type for the return type-of a specific action on a model

type ModelActionResult<
  T extends ModelName,
  A extends 'aggregate' | 'updateMany' | 'update',
> = Prisma.Result<(typeof db)[T], ModelActionArgs<T, A>, A>;

type RankUpdate = {
  id: string;
  rank: number;
};

// No `any` — all fully typed using Prisma.Result<>
type RankableModel<T extends ModelName> = {
  aggregate(args: ModelActionArgs<T, 'aggregate'>): Promise<ModelActionResult<T, 'aggregate'>>;
  updateMany(args: ModelActionArgs<T, 'updateMany'>): Promise<Prisma.BatchPayload>;
  update(args: ModelActionArgs<T, 'update'>): Promise<ModelActionResult<T, 'update'>>;
};

type AggregateMaxShape = {
  _max?: Record<string, number | null>;
};

/**
 * Gets the next available rank for a new item.
 */
// lib/ranking.ts - Updated getNextRank implementation
export async function getNextRank<T extends ModelName>(
  model: T,
  where?: ModelActionArgs<T, 'aggregate'>['where'],
  field: string = 'rank',
): Promise<number> {
  const txDelegate = db[model] as unknown as RankableModel<T>;

  const args = {
    _max: { [field]: true },
    where,
  } as unknown as ModelActionArgs<T, 'aggregate'>;

  const result = await txDelegate.aggregate(args);
  const maxRank = (result as AggregateMaxShape)._max?.[field] ?? 0;
  return maxRank + 1;
}
/**
 * Reorders items after one is deleted to fill the gap.
 */
export async function reorderAfterDelete<T extends ModelName>(
  model: T,
  whereScope: ModelActionArgs<T, 'updateMany'>['where'],
  deletedRank: number,
  field: string = 'rank',
): Promise<void> {
  const args = {
    where: {
      ...whereScope,
      [field]: { gt: deletedRank },
    },
    data: {
      [field]: { decrement: 1 },
    },
  } as unknown as ModelActionArgs<T, 'updateMany'>;

  const delegate = db[model] as unknown as RankableModel<T>;

  await delegate.updateMany(args);
}

/**
 * Performs a bulk reorder of items within a transaction for safety.
 */
export async function bulkReorder<T extends ModelName>(
  model: T,
  whereScope: ModelActionArgs<T, 'updateMany'>['where'], // <-- FIXED
  updates: RankUpdate[],
  field: string = 'rank',
): Promise<void> {
  if (updates.length === 0) return;

  await db.$transaction(async (tx) => {
    const txClient = tx as typeof db;
    const txDelegate = txClient[model] as unknown as RankableModel<T>;

    const aggregateArgs = {
      _max: { [field]: true },
      where: whereScope,
    } as unknown as ModelActionArgs<T, 'aggregate'>;

    const result = await txDelegate.aggregate(aggregateArgs);
    const maxRank = (result as AggregateMaxShape)._max?.[field] ?? 0;
    const safeOffset = maxRank + updates.length + 1;

    // Step 1: temporary high ranks
    await Promise.all(
      updates.map(({ id, rank }) => {
        const updateArgs = {
          where: { id }, // keep unique for `update`
          data: { [field]: safeOffset + rank },
        } as unknown as ModelActionArgs<T, 'update'>;
        return txDelegate.update(updateArgs);
      }),
    );

    // Step 2: final ranks
    await Promise.all(
      updates.map(({ id, rank }) => {
        const updateArgs = {
          where: { id },
          data: { [field]: rank },
        } as unknown as ModelActionArgs<T, 'update'>;
        return txDelegate.update(updateArgs);
      }),
    );
  });
}

export async function bulkReorderBySecondaryKey<T extends ModelName>(
  model: T,
  primaryKeyName: string, // e.g. "categoryId"
  primaryKeyValue: string, // e.g. current categoryId
  secondaryKeyName: string, // e.g. "partnerId" | "projectId"
  updates: { id: string; rank: number }[],
  field: string = 'rank',
): Promise<void> {
  if (!updates.length) return;

  const delegate = db[model] as unknown as RankableModel<T>;

  // 1) compute safe offset
  const aggregateArgs = {
    _max: { [field]: true },
    where: { [primaryKeyName]: primaryKeyValue } as Record<string, unknown>,
  } as unknown as ModelActionArgs<T, 'aggregate'>;

  const result = await delegate.aggregate(aggregateArgs);
  const maxRank = (result as AggregateMaxShape)._max?.[field] ?? 0;
  const safeOffset = maxRank + updates.length + 1;

  // helper to build composite-where args without `any`
  const compositeWhere = (secondaryValue: string) =>
    ({
      [`${primaryKeyName}_${secondaryKeyName}`]: {
        [primaryKeyName]: primaryKeyValue,
        [secondaryKeyName]: secondaryValue,
      },
    }) as unknown;

  // 2) bump ranks temporarily
  await Promise.all(
    updates.map(({ id, rank }) => {
      const updateArgs = {
        where: compositeWhere(id),
        data: { [field]: safeOffset + rank },
      } as unknown as ModelActionArgs<T, 'update'>;
      return delegate.update(updateArgs);
    }),
  );

  // 3) set final ranks
  await Promise.all(
    updates.map(({ id, rank }) => {
      const updateArgs = {
        where: compositeWhere(id),
        data: { [field]: rank },
      } as unknown as ModelActionArgs<T, 'update'>;
      return delegate.update(updateArgs);
    }),
  );
}
