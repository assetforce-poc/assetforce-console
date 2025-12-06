import { useMemo, useCallback } from 'react';
import { useAdapterFieldArray, useAdapterFormContext } from '../adapters/rhf';
import type { FieldArrayProps, FieldArrayRenderProps, FieldArrayItem } from './types';

/**
 * FieldArray component - manage dynamic array fields
 *
 * @example
 * ```tsx
 * <FieldArray name="items">
 *   {({ fields, append, remove, getName }) => (
 *     <div>
 *       {fields.map((field, index) => (
 *         <div key={field.id}>
 *           <Field name={getName(index, 'name')} component={TextInput} />
 *           <button onClick={() => remove(index)}>Remove</button>
 *         </div>
 *       ))}
 *       <button onClick={() => append({ name: '' })}>Add Item</button>
 *     </div>
 *   )}
 * </FieldArray>
 * ```
 */
export const FieldArray = <T extends Record<string, unknown> = Record<string, unknown>>(props: FieldArrayProps<T>) => {
  const { name, children } = props;

  // Access adapter context for field array operations
  const methods = useAdapterFormContext();

  const { fields, append, prepend, insert, remove, swap, move, update, replace } = useAdapterFieldArray({
    control: methods.control,
    name,
  });

  // Helper to generate nested field names
  const getName = useCallback((index: number, fieldName: string) => `${name}.${index}.${fieldName}`, [name]);

  // Build render props
  const renderProps: FieldArrayRenderProps<T> = useMemo(
    () => ({
      fields: fields as FieldArrayItem<T>[],
      append: (value: T | T[]) => append(value),
      prepend: (value: T | T[]) => prepend(value),
      insert: (index: number, value: T | T[]) => insert(index, value),
      remove: (index?: number | number[]) => remove(index),
      swap,
      move,
      update: (index: number, value: T) => update(index, value),
      replace: (values: T[]) => replace(values),
      getName,
    }),
    [fields, append, prepend, insert, remove, swap, move, update, replace, getName]
  );

  return <>{children(renderProps)}</>;
};

FieldArray.displayName = 'FieldArray';
