import { renderHook, act } from '@testing-library/react';
import { useFieldMetaStorage } from './useFieldMetaStorage';

describe('useFieldMetaStorage', () => {
  it('should initialize with empty storage', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    expect(result.current.get('nonexistent')).toBeUndefined();
  });

  it('should set and get meta', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('email', { error: 'Invalid email' });
    });

    expect(result.current.get('email')).toEqual({ error: 'Invalid email' });
  });

  it('should merge meta on set', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('email', { error: 'Error 1' });
      result.current.set('email', { loading: true });
    });

    expect(result.current.get('email')).toEqual({
      error: 'Error 1',
      loading: true,
    });
  });

  it('should get multiple fields', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('field1', { error: 'Error 1' });
      result.current.set('field2', { error: 'Error 2' });
    });

    expect(result.current.getMultiple(['field1', 'field2', 'field3'])).toEqual([
      { error: 'Error 1' },
      { error: 'Error 2' },
      undefined,
    ]);
  });

  it('should clear meta', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('email', { error: 'Error' });
      result.current.clear('email');
    });

    expect(result.current.get('email')).toBeUndefined();
  });

  it('should check some predicate', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('field1', { loading: false });
      result.current.set('field2', { loading: true });
    });

    expect(result.current.some((meta) => meta.loading === true)).toBe(true);
    expect(result.current.some((meta) => meta.error !== undefined)).toBe(false);
  });

  it('should check every predicate', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('field1', { loading: true });
      result.current.set('field2', { loading: true });
    });

    expect(result.current.every((meta) => meta.loading === true)).toBe(true);

    act(() => {
      result.current.set('field2', { loading: false });
    });

    expect(result.current.every((meta) => meta.loading === true)).toBe(false);
  });

  it('should return true for every on empty storage', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    expect(result.current.every(() => false)).toBe(true);
  });
});

describe('ValidatorRegistry', () => {
  it('should register and run validator', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.validators.register('email', () => 'Email error');
    });

    expect(result.current.validators.run('email')).toBe('Email error');
  });

  it('should return meta.error first if set', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('email', { error: 'Meta error' });
      result.current.validators.register('email', () => 'Validator error');
    });

    expect(result.current.validators.run('email')).toBe('Meta error');
  });

  it('should unregister validator', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.validators.register('email', () => 'Error');
      result.current.validators.unregister('email');
    });

    expect(result.current.validators.run('email')).toBeNull();
  });

  it('should run all validators', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.validators.register('field1', () => 'Error 1');
      result.current.validators.register('field2', () => null);
      result.current.set('field3', { error: 'Meta error' });
    });

    const errors = result.current.validators.runAll();

    expect(errors).toEqual({
      field1: 'Error 1',
      field2: null,
      field3: 'Meta error',
    });
  });

  it('should preserve other meta when unregistering validator', () => {
    const { result } = renderHook(() => useFieldMetaStorage());

    act(() => {
      result.current.set('email', { loading: true });
      result.current.validators.register('email', () => 'Error');
      result.current.validators.unregister('email');
    });

    expect(result.current.get('email')).toEqual({ loading: true });
  });
});
