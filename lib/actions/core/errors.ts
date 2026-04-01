// lib/actions/core/errors.ts
import { Prisma } from '@/generated/prisma/client';
import type { ActionResult } from './types';

export function mapPrismaKnownRequestError<Out>(
  error: unknown,
  values: Record<string, unknown>,
): ActionResult<Out> | null {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const target = error.meta?.target as readonly string[] | undefined;
      const field = target?.[0] ?? 'field';
      return {
        errors: { [field]: [`This ${field} is already in use. Please choose another.`] },
        values: values as Partial<Out>,
        success: false,
      };
    }
    if (error.code === 'P2025') {
      return {
        errors: { _form: ['Record not found.'] },
        values: values as Partial<Out>,
        success: false,
      };
    }
  }
  return null;
}

export function mapUnknownError<Out>(
  error: unknown,
  values: Record<string, unknown>,
): ActionResult<Out> {
  if (error instanceof Error) {
    return {
      errors: { _form: [error.message] },
      values: values as Partial<Out>,
      success: false,
    };
  }
  return {
    errors: { _form: ['An unexpected error occurred. Please try again later.'] },
    values: values as Partial<Out>,
    success: false,
  };
}
