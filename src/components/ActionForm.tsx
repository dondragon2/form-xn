import { Form } from '@remix-run/react';
import { type FormEvent, type ReactNode, useState } from 'react';
import type { SafeValidator } from '../types';
import { ActionFormContext, type FormErrorMap } from './ActionFormContext';

type ActionFormProps = {
  action: string;
  validator?: SafeValidator<any, any>;
  children?: ReactNode | ((args: { errors: FormErrorMap }) => ReactNode);
};

export const ActionForm = ({ action, validator, children }: ActionFormProps) => {
  const [errors, setErrors] = useState<FormErrorMap>({});
  const [intent, search] = action.split('?');
  const queryParams = new URLSearchParams(search || '');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setErrors({});
    if (!validator) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, unknown> = {};

    formData.forEach((value, key) => {
      if (typeof value === 'string') {
        data[key] = value;
      }
    });

    const result = validator.safeParse(data);

    if (!result.success) {
      e.preventDefault();

      const fieldErrors: Record<string, string> = {};

      if ('errors' in result) {
        const rawErrors = result.errors;
        for (const key in rawErrors) {
          const val = rawErrors[key];
          if (Array.isArray(val)) fieldErrors[key] = val[0];
          else if (typeof val === 'string') fieldErrors[key] = val;
        }
      }

      setErrors(fieldErrors);
    }
  }

  return (
    <ActionFormContext.Provider value={errors}>
      <Form method='post' onSubmit={handleSubmit}>
        <input type='hidden' name='_action' value={intent} />
        <>
          {Array.from(queryParams.entries()).map(([key, value]) => (
            <input key={key} type='hidden' name={key} value={value} />
          ))}
        </>
        {typeof children === 'function' ? <>{children({ errors })}</> : <>{children}</>}
      </Form>
    </ActionFormContext.Provider>
  );
};
