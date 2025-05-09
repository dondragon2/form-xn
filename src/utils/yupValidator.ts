import type { Schema, ValidationError } from 'yup';
import type { SafeValidator, SafeValidationResult } from '../types';

/**
 * Adapter to make Yup behave like a SafeValidator<T>
 */
export function yupValidator<P, T>(schema: Schema<T>): SafeValidator<P, T> {
  return {
    safeParse(input: P): SafeValidationResult<T> {
      try {
        const data = schema.validateSync(input, {
          abortEarly: false,
          strict: false, // allow loose parsing like Zod
        });
        return { success: true, data };
      } catch (err) {
        const yupError = err as ValidationError;

        const errors: Record<string, string[]> = {};
        for (const inner of yupError.inner) {
          const key = inner.path || '_form';
          if (!errors[key]) {
            errors[key] = [];
          }
          errors[key].push(inner.message);
        }

        return {
          success: false,
          errors,
        };
      }
    },
  };
}
