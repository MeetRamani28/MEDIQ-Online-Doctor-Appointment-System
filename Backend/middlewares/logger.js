/**
 * Express Request Logger Middleware.
 * Logs HTTP requests with method, path, response status, and duration in ms.
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusIcon = status >= 400 ? "🔴" : status >= 300 ? "🟡" : "🟢";

    console.log(
      `[HTTP] ${statusIcon} ${method} ${originalUrl} -> Status: ${status} (${duration}ms)`
    );
  });

  next();
};

module.exports = requestLogger;
