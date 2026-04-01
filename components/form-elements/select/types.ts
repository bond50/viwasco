import type { ActionMeta, OnChangeValue, Props as RSProps } from 'react-select';

// Base option type
export interface BaseOption {
  value: string;
}

// Reusable option with generic label type
export type GenericOption<TLabel = string> = BaseOption & { label: TLabel };

// Public props (same surface you already used)
export interface SelectComponentProps<
  IsMulti extends boolean = false,
  TLabel = string,
> extends Omit<
  RSProps<GenericOption<TLabel>, IsMulti>,
  'value' | 'defaultValue' | 'onChange' | 'instanceId' | 'inputId'
> {
  name: string;
  label?: string;
  error?: string;
  value?: OnChangeValue<GenericOption<TLabel>, IsMulti>;
  defaultValue?: OnChangeValue<GenericOption<TLabel>, IsMulti>;
  onChange?: (
    newValue: OnChangeValue<GenericOption<TLabel>, IsMulti>,
    actionMeta: ActionMeta<GenericOption<TLabel>>,
  ) => void;
  isMulti?: IsMulti;
  id?: string;
  instanceId?: string;
  inputId?: string;
}
