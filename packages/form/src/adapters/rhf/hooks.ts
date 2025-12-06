/**
 * RHF-specific hooks re-exported for internal use
 *
 * Field and FieldArray components use these hooks through the adapter
 * instead of importing directly from react-hook-form.
 *
 * This keeps all RHF imports in the adapter module, making it easier
 * to swap adapters in the future.
 */

export {
  Controller,
  useFormContext as useAdapterFormContext,
  useFieldArray as useAdapterFieldArray,
} from 'react-hook-form';

export type {
  ControllerRenderProps,
  ControllerFieldState,
  FieldArrayWithId,
  UseFieldArrayReturn,
} from 'react-hook-form';
