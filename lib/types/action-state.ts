// types/action-state.ts
export type ActionState<T> = {
  errors?: Record<string, string[]>;
  values?: Partial<T>;
  success?: boolean;
};
