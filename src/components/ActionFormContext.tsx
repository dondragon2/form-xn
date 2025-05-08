import { createContext, useContext } from 'react';

export type FormErrorMap = Record<string, string>;

export const ActionFormContext = createContext<FormErrorMap>({});

export function useClientFormErrors(): FormErrorMap {
  return useContext(ActionFormContext);
}
