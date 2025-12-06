import type { ReactNode } from 'react';

/**
 * Field array item with unique ID
 */
export type FieldArrayItem<T = Record<string, unknown>> = T & {
  /** Unique identifier for the item (used for React key) */
  id: string;
};

/**
 * Field array API - operations for managing array fields
 */
export type FieldArrayAPI<T = Record<string, unknown>> = {
  /** Array of items with IDs */
  fields: FieldArrayItem<T>[];

  /** Append item(s) to the end */
  append: (value: T | T[]) => void;

  /** Prepend item(s) to the start */
  prepend: (value: T | T[]) => void;

  /** Insert item(s) at index */
  insert: (index: number, value: T | T[]) => void;

  /** Remove item(s) by index */
  remove: (index?: number | number[]) => void;

  /** Swap two items */
  swap: (indexA: number, indexB: number) => void;

  /** Move item to new index */
  move: (from: number, to: number) => void;

  /** Update item at index */
  update: (index: number, value: T) => void;

  /** Replace entire array */
  replace: (values: T[]) => void;
};

/**
 * FieldArray render prop
 */
export type FieldArrayRenderProps<T = Record<string, unknown>> = FieldArrayAPI<T> & {
  /** Field name for nested fields (e.g., "items.0.name") */
  getName: (index: number, fieldName: string) => string;
};

/**
 * FieldArray component props
 */
export type FieldArrayProps<T = Record<string, unknown>> = {
  /** Field name for the array */
  name: string;

  /** Render function */
  children: (props: FieldArrayRenderProps<T>) => ReactNode;
};
