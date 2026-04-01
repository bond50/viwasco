// lib/actions/execute-action.ts
'use server';

import { requireCurrentUser } from '@/lib/auth/auth-utils';
import { ActionOptions, ActionResult, FieldTypeSpec } from '@/lib/actions/core/types';
import { extractFormData, parseFields } from '@/lib/actions/core/parsers';
import { validateWithZod } from '@/lib/actions/core/validation';
import { mapPrismaKnownRequestError, mapUnknownError } from '@/lib/actions/core/errors';
import { postSuccess } from '@/lib/actions/core/post-success';

export async function executeAction<Out, In = unknown>(
  opts: ActionOptions<Out, In>,
): Promise<ActionResult<Out>> {
  const {
    schema,
    formData,
    execute,
    redirectTo,
    revalidate,
    revalidatePaths,
    revalidateTags,
    jsonFields = [],
    booleanFields = [],
    numberFields = [],
    fileFields = [],
    dateFields = [],
  } = opts;

  const rawForm = extractFormData(formData);
  const parsedData = parseFields(rawForm, {
    json: jsonFields,
    boolean: booleanFields,
    number: numberFields,
    file: fileFields,
    date: dateFields,
  } satisfies FieldTypeSpec);

  const validation = await validateWithZod(schema, parsedData);
  if (!validation.ok) return validation.result;

  // ✅ Parsed, strongly-typed data
  const data = validation.data;

  try {
    const user = await requireCurrentUser();
    // Your app-level execute() can ignore or use `user`
    await execute(data, user);
  } catch (err) {
    const prismaMapped = mapPrismaKnownRequestError<Out>(err, parsedData);
    if (prismaMapped) return prismaMapped;
    return mapUnknownError<Out>(err, parsedData);
  }

  // success path — outside try/catch so redirect isn't swallowed
  postSuccess({ revalidate, revalidatePaths, revalidateTags, redirectTo });

  // ⬅️ KEY CHANGE: we now echo the successful core-values back
  return {
    success: true,
    values: data as Out,
  };
}
