import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required to initialize Prisma.');
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

type PrismaClientInstance = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as typeof globalThis & {
  prismaGlobal?: PrismaClientInstance;
};

function hasRequiredDelegates(client: PrismaClientInstance | undefined) {
  if (
    !client?.service ||
    !client?.serviceCategory ||
    !client?.project ||
    !client?.resource ||
    !client?.tender ||
    !client?.career ||
    !client?.careerType ||
    !client?.newsletter ||
    !client?.newsletterCategory ||
    !client?.news ||
    !client?.contactMessage
  ) {
    return false;
  }

  const runtimeModel = (
    client as PrismaClientInstance & {
      _runtimeDataModel?: {
        models?: Record<string, { fields?: Array<{ name: string }> }>;
      };
    }
  )._runtimeDataModel;

  const projectFields = runtimeModel?.models?.Project?.fields ?? [];
  const resourceFields = runtimeModel?.models?.Resource?.fields ?? [];
  const tenderFields = runtimeModel?.models?.Tender?.fields ?? [];
  const careerFields = runtimeModel?.models?.Career?.fields ?? [];
  const newsletterFields = runtimeModel?.models?.Newsletter?.fields ?? [];
  const newsFields = runtimeModel?.models?.News?.fields ?? [];
  const contactMessageFields = runtimeModel?.models?.ContactMessage?.fields ?? [];

  const hasProjectContentField = projectFields.some((field) => field.name === 'content');
  const hasResourceFileField = resourceFields.some((field) => field.name === 'file');
  const hasTenderSummaryField = tenderFields.some((field) => field.name === 'summary');
  const hasCareerTypeField = careerFields.some((field) => field.name === 'typeId');
  const hasNewsletterContentField = newsletterFields.some((field) => field.name === 'content');
  const hasNewsContentField = newsFields.some((field) => field.name === 'content');
  const hasContactMessageTypeField = contactMessageFields.some(
    (field) => field.name === 'contact_type',
  );

  return (
    hasProjectContentField &&
    hasResourceFileField &&
    hasTenderSummaryField &&
    hasCareerTypeField &&
    hasNewsletterContentField &&
    hasNewsContentField &&
    hasContactMessageTypeField
  );
}

const cachedPrisma = globalForPrisma.prismaGlobal;
const isProduction = process.env.NODE_ENV === 'production';

const prisma: PrismaClientInstance =
  isProduction && cachedPrisma && hasRequiredDelegates(cachedPrisma)
    ? cachedPrisma
    : prismaClientSingleton();

if (cachedPrisma && (!isProduction || !hasRequiredDelegates(cachedPrisma))) {
  void cachedPrisma.$disconnect().catch(() => undefined);
}

export const db: PrismaClientInstance = prisma;

if (!isProduction) {
  globalForPrisma.prismaGlobal = db;
}
