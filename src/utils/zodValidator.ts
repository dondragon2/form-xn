import { z } from 'zod';
import type { SafeValidator, SafeValidationResult } from '../types';

/**
 * Adapter to make Zod behave like a SafeValidator<T>
 */
export function zodValidator<P, T>(schema: z.ZodType<T>): SafeValidator<P, T> {
  return {
    safeParse(input: P): SafeValidationResult<T> {
      const result = schema.safeParse(input);

      if (result.success) {
        return { success: true, data: result.data };
      } else {
        const errors: Record<string, string[]> = {};
        
        for (const issue of result.error.issues) {
          const path = issue.path.length > 0 ? issue.path.join('.') : '_form';
          
          if (!errors[path]) {
            errors[path] = [];
          }
          
          errors[path].push(issue.message);
        }
        
        return {
          success: false,
          errors,
        };
      }
    },
  };
}