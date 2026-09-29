const https = require("https");
const http = require("http");

/**
 * Automated Keep-Alive Worker Daemon for Render Free-Tier Hosting.
 * Prevents 15-minute idle sleep timeout by self-pinging the /health endpoint every 12 minutes.
 */
function startKeepAlive() {
  const targetUrl =
    process.env.BACKEND_URL || "https://mediq-backend-mf7h.onrender.com";
  const healthPath = "/health";
  const intervalMs = 12 * 60 * 1000; // 12 minutes (Render sleeps after 15 mins)

  const fullUrl = targetUrl.replace(/\/$/, "") + healthPath;

  console.log(`[Keep-Alive Daemon] Initialized worker for: ${fullUrl}`);

  const ping = () => {
    const startTime = Date.now();
    const urlObj = new URL(fullUrl);
    const client = urlObj.protocol === "https:" ? https : http;

    const req = client.get(
      fullUrl,
      {
        headers: {
          "User-Agent": "MEDIQ-KeepAlive-Daemon/1.0",
        },
        timeout: 10000,
      },
      (res) => {
        const responseTime = Date.now() - startTime;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(
            `[Keep-Alive Daemon] 🟢 Self-ping success (${res.statusCode} OK) - Response time: ${responseTime}ms - ${new Date().toISOString()}`
          );
        } else {
          console.warn(
            `[Keep-Alive Daemon] ⚠️ Self-ping returned status ${res.statusCode} - ${new Date().toISOString()}`
          );
        }
      }
    );

    req.on("error", (err) => {
      console.error(
        `[Keep-Alive Daemon] 🔴 Self-ping error: ${err.message} - ${new Date().toISOString()}`
      );
      // Retry once after 30 seconds if initial ping failed
      setTimeout(pingOnceRetry, 30000);
    });

    req.on("timeout", () => {
      req.destroy();
      console.error(
        `[Keep-Alive Daemon] 🔴 Self-ping timed out after 10s - ${new Date().toISOString()}`
      );
    });
  };

  const pingOnceRetry = () => {
    console.log(`[Keep-Alive Daemon] 🔄 Retrying self-ping...`);
    ping();
  };

  // Run initial ping 15 seconds after boot up
  setTimeout(ping, 15000);

  // Set recurring interval ping every 12 minutes
  const intervalId = setInterval(ping, intervalMs);

  // Ensure process unrefs interval if needed (node process hygiene)
  if (intervalId.unref) {
    intervalId.unref();
  }
}

module.exports = startKeepAlive;
