/**
 * Error object structure
 */
export type FieldError = {
  message?: string;
};

/**
 * Errors API - namespace for error operations
 */
export type ErrorsAPI = {
  /**
   * Get error for a field
   */
  get(name: string): FieldError | undefined;

  /**
   * Set error for a field
   * @param name Field name
   * @param message Error message (undefined to clear)
   */
  set(name: string, message: string | undefined): void;

  /**
   * Clear all errors or specific field error
   */
  clear(name?: string): void;

  /**
   * Check if a field has error
   */
  has(name: string): boolean;
};
