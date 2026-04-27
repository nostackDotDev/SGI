export const defaultSuccessMessage = "Operação realizada com sucesso";
export const defaultErrorMessage = "Não foi possível completar a operação";

export function formatResponse({ data = null, error = null, message = null }) {
  const normalizedError = error
    ? typeof error === "string"
      ? error
      : error?.message ?? String(error)
    : null;

  return {
    message:
      message ??
      (normalizedError ? defaultErrorMessage : defaultSuccessMessage),
    data: normalizedError ? null : data,
    error: normalizedError,
  };
}

export function sendSuccess(res, data, message = defaultSuccessMessage, status = 200) {
  return res.status(status).json(formatResponse({ data, message, error: null }));
}

export function sendError(
  res,
  message = defaultErrorMessage,
  error = null,
  status = 400,
) {
  return res.status(status).json(formatResponse({ data: null, error, message }));
}
