import { formatResponse, sendError, sendSuccess } from "../lib/responseFormatter.js";

export function responseFormatter(req, res, next) {
  const originalJson = res.json.bind(res);

  res.sendSuccess = (data, message, status = 200) =>
    res.status(status).json(formatResponse({ data, message, error: null }));

  res.sendError = (message, error, status = 400) =>
    res.status(status).json(formatResponse({ data: null, error, message }));

  res.json = (payload) => {
    if (payload && typeof payload === "object") {
      const hasData = Object.prototype.hasOwnProperty.call(payload, "data");
      const hasError = Object.prototype.hasOwnProperty.call(payload, "error");
      const message = payload.message || null;

      if (hasData || hasError) {
        return originalJson(
          formatResponse({
            data: payload.data,
            error: payload.error,
            message,
          }),
        );
      }
    }

    return originalJson(formatResponse({ data: payload, error: null }));
  };

  next();
}
