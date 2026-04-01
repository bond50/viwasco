// lib/actions/json-helpers.ts
import { Prisma } from '@/generated/prisma/client';

type JsonNull = typeof Prisma.JsonNull;

/** For NON-NULLABLE JSON columns (e.g., OrganizationDocument.file) */
export function jsonForPrismaRequired(v: unknown | null): Prisma.InputJsonValue | JsonNull {
  return v === null ? Prisma.JsonNull : (v as Prisma.InputJsonValue);
}

/** For NULLABLE JSON columns */
export function jsonForPrisma(
  v: unknown | null | undefined,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (v === undefined) return undefined; // omit field
  if (v === null) return Prisma.JsonNull; // explicit JSON null
  return v as Prisma.InputJsonValue;
}
