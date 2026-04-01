// lib/data/admin/about/content/metrics.ts
import 'server-only';
import { db } from '@/lib/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ABOUT_METRICS_TAG } from '@/lib/cache/tags';

export type AdminMetricRow = {
  id: string;
  label: string;
  value: number;
  unit: string | null;
  icon: string | null;
  published: boolean;
  rank: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function listMetrics(): Promise<AdminMetricRow[]> {
  return db.organizationMetric.findMany({
    orderBy: { rank: 'asc' },
    select: {
      id: true,
      label: true,
      value: true,
      unit: true,
      icon: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getMetricById(id: string): Promise<AdminMetricRow | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag(ABOUT_METRICS_TAG);

  return db.organizationMetric.findUnique({
    where: { id },
    select: {
      id: true,
      label: true,
      value: true,
      unit: true,
      icon: true,
      published: true,
      rank: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
