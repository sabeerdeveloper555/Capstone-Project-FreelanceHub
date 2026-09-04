/**
 * Extracts a user-friendly error message from an Axios error or any thrown error.
 *
 * Priority:
 * 1. Backend response message (error.response.data.message)
 * 2. Network/timeout error (no response — server unreachable)
 * 3. Generic Axios message
 * 4. Caller-supplied fallback
 *
 * @param {unknown} error - The caught error object
 * @param {string} [fallback] - Fallback message when no specific message is available
 * @returns {string}
 */
export const getErrorMessage = (
  error,
  fallback = 'Something went wrong. Please try again.'
) => {
  // Backend returned a structured JSON error response
  const serverMessage = error?.response?.data?.message;
  if (serverMessage && typeof serverMessage === 'string' && serverMessage.trim()) {
    return serverMessage.trim();
  }

  // Network error — backend is unreachable (no response object at all)
  if (error?.request && !error?.response) {
    return 'Unable to connect to the server. Please check your connection and try again.';
  }

  // Axios or JS error with a message string
  if (error?.message && typeof error.message === 'string' && error.message.trim()) {
    // Avoid leaking Axios internals like "Request failed with status code 401"
    // when we already have a better fallback context
    const msg = error.message.trim();
    if (!msg.toLowerCase().startsWith('request failed with status code')) {
      return msg;
    }
  }

  return fallback;
};
