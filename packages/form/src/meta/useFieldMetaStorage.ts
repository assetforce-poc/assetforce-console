import { useRef, useCallback, useMemo } from 'react';
import type { FieldMeta, MetaStorage, ValidatorRegistry } from '../core/types';

type MetaStore = Map<string, FieldMeta>;

/**
 * Hook that creates a FieldMeta storage system
 * Stores: error, validator, loading, progress, and any custom data per field
 */
export const useFieldMetaStorage = (): MetaStorage & { validators: ValidatorRegistry } => {
  const storeRef = useRef<MetaStore>(new Map());

  const get = useCallback((name: string): FieldMeta | undefined => storeRef.current.get(name), []);

  const getMultiple = useCallback(
    (names: string[]): (FieldMeta | undefined)[] => names.map((name) => storeRef.current.get(name)),
    []
  );

  const set = useCallback((name: string, meta: Partial<FieldMeta>): void => {
    const current = storeRef.current.get(name) || {};
    storeRef.current.set(name, { ...current, ...meta });
  }, []);

  const clear = useCallback((name: string): void => void storeRef.current.delete(name), []);

  const some = useCallback((predicate: (meta: FieldMeta, name: string) => boolean): boolean => {
    for (const [name, meta] of storeRef.current) {
      if (predicate(meta, name)) return true;
    }
    return false;
  }, []);

  const every = useCallback((predicate: (meta: FieldMeta, name: string) => boolean): boolean => {
    if (storeRef.current.size === 0) return true;
    for (const [name, meta] of storeRef.current) {
      if (!predicate(meta, name)) return false;
    }
    return true;
  }, []);

  // Validator registry (reads from meta.validator)
  const validators: ValidatorRegistry = useMemo(
    () => ({
      register: (name: string, fn: () => string | null | undefined) => set(name, { validator: fn }),
      unregister: (name: string) => {
        const current = storeRef.current.get(name);
        if (!current) return;
        const { validator: _, ...rest } = current;
        if (Object.keys(rest).length > 0) {
          storeRef.current.set(name, rest);
        } else {
          storeRef.current.delete(name);
        }
      },
      run: (name: string) => {
        const meta = storeRef.current.get(name);
        // First check meta.error (immediate errors set by component)
        if (meta?.error) return meta.error;
        // Then run registered validator
        return meta?.validator?.() ?? null;
      },
      runAll: () => {
        const results: Record<string, string | null | undefined> = {};
        for (const [name, meta] of storeRef.current) {
          if (meta.error) {
            results[name] = meta.error;
          } else if (meta.validator) {
            results[name] = meta.validator();
          }
        }
        return results;
      },
    }),
    [set]
  );

  return {
    get,
    getMultiple,
    set,
    clear,
    some,
    every,
    validators,
  };
};
