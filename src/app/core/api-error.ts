import { HttpErrorResponse } from '@angular/common/http';

// Turns any API error into one readable sentence.
// Handles our own { message } errors and ASP.NET validation errors ({ errors: { Field: [..] } }).
export function errorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const e = err as HttpErrorResponse;

  if (e?.status === 0) return 'Cannot reach the server. Check that the API is running.';

  const body = e?.error;
  if (body?.message) return body.message;

  if (body?.errors) {
    const groups = Object.values(body.errors as Record<string, string[]>);
    if (groups.length && groups[0].length) return groups[0][0];
  }

  if (typeof body?.title === 'string') return body.title;
  return fallback;
}
