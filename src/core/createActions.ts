import type { ActionFunctionArgs } from '@remix-run/node';
import type { ValidatedHandlerContext, ActionFormMap, SafeValidationResult } from '../types';

/**
 * Accepts a map of named handlers.
 * Each handler can be:
 * - A simple Remix ActionFunction
 * - Or a validated handler with a validator + handler
 */
export const createActions =
  <M extends ActionFormMap>(handlers: M) =>
  async (args: ActionFunctionArgs): Promise<Response> => {
    const formData = await args.request.formData();
    const intent = formData.get('_action');

    if (!intent || typeof intent !== 'string') {
      return new Response('Missing _action field', { status: 400 });
    }

    const handler = handlers[intent];
    if (!handler) {
      return new Response(`Unknown action: ${intent}`, { status: 400 });
    }

    const query = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        query.set(key, value);
      }
    }

    // Simple Remix-style handler (no validation)
    if (typeof handler === 'function') {
      return handler({ ...args, formData, query });
    }

    // Validated handler
    const result = handler.validator.safeParse(
      Object.fromEntries(query.entries())
    ) as SafeValidationResult<unknown>;

    if (!result.success) {
      return Response.json({ errors: result.errors });
    }

    const context: ValidatedHandlerContext<unknown> = {
      data: result.data,
      formData,
      query,
      request: args.request,
    };

    return handler.handler(context);
  };
