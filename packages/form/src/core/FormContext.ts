import { createContext } from 'react';
import type { FormContextValue } from './types';

/**
 * Form context - provides form API to child components
 */
export const FormContext = createContext<FormContextValue | null>(null);

FormContext.displayName = 'AssetForceFormContext';
