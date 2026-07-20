export function getApiErrorMessage(error: unknown, fallback: string): string {
  const err = error as { response?: { data?: { message?: string; error?: string; details?: Array<{ message?: string }> } }; message?: string };

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.response?.data?.error) {
    const details = err.response.data.details;
    if (Array.isArray(details) && details.length > 0 && details[0]?.message) {
      return details[0].message;
    }
    return err.response.data.error;
  }

  if (err?.message?.includes('Network Error')) {
    return 'Unable to reach the server. Check your connection or try again in a moment.';
  }

  return fallback;
}
