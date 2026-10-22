export const getErrorResponseData = <T>(error: unknown): T | undefined => {
  if (!error || typeof error !== "object" || !("response" in error)) {
    return undefined;
  }

  const response = (error as { response?: unknown }).response;

  if (!response || typeof response !== "object" || !("data" in response)) {
    return undefined;
  }

  return (response as { data?: T }).data;
};
