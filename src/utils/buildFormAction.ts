/**
 * Builds a form action string in the format: "intent?key=value&..."
 * Useful for dynamic form actions that support multiple named handlers.
 */
export function buildFormAction<
  Intent extends string,
  Params extends Record<string, string | number | boolean | undefined | null>,
>(intent: Intent, params?: Params): string {
  const query = new URLSearchParams();

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }
  }

  const queryString = query.toString();
  return queryString ? `${intent}?${queryString}` : intent;
}
