export type SafeValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string | string[]> };

export interface SafeValidator<P, T> {
  safeParse(input: P): SafeValidationResult<T>;
}

export interface ValidatedHandlerContext<T> {
  data: T;
  formData: FormData;
  query: URLSearchParams;
  request: Request;
}

export type SimpleHandlerArgs = import('@remix-run/node').ActionFunctionArgs & {
  formData: FormData;
  query: URLSearchParams;
};

export type SimpleHandler = (args: SimpleHandlerArgs) => Promise<Response> | Response;

export interface ValidatedHandler<T> {
  validator: SafeValidator<Partial<T>, T>;
  handler: (ctx: ValidatedHandlerContext<T>) => Promise<Response> | Response;
}

export type ActionFormMap = Record<string, SimpleHandler | ValidatedHandler<any>>;
