const https = require('https');
const http = require('http');

/**
 * Self-ping mechanism to keep Render free tier web service awake.
 * Render free tier spins down services after 15 minutes of inactivity.
 * This utility pings the service every 14 minutes to prevent sleep.
 */
function startKeepAlive() {
  // Render automatically injects RENDER_EXTERNAL_URL in production.
  // BACKEND_URL can also be manually supplied in environment variables.
  const rawUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;

  if (!rawUrl) {
    console.log('[Keep-Alive] Self-ping disabled: Neither RENDER_EXTERNAL_URL nor BACKEND_URL is set.');
    return;
  }

  const targetUrl = `${rawUrl.replace(/\/+$/, '')}/health`;
  const INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

  console.log(`[Keep-Alive] Active! Scheduled to ping ${targetUrl} every 14 minutes.`);

  const ping = () => {
    try {
      const client = targetUrl.startsWith('https://') ? https : http;
      const req = client.get(targetUrl, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[Keep-Alive] Ping succeeded at ${new Date().toISOString()} (Status: ${res.statusCode})`);
        } else {
          console.warn(`[Keep-Alive] Ping returned non-OK status: ${res.statusCode}`);
        }
        res.resume(); // Consume data to free memory
      });

      req.on('error', (err) => {
        console.error(`[Keep-Alive] Ping failed:`, err.message);
      });

      req.setTimeout(15000, () => {
        req.destroy();
        console.warn(`[Keep-Alive] Ping timed out after 15s`);
      });
    } catch (err) {
      console.error(`[Keep-Alive] Unexpected error during ping:`, err.message);
    }
  };

  // Run first ping after interval
  const intervalId = setInterval(ping, INTERVAL_MS);

  if (intervalId.unref) {
    intervalId.unref();
  }
}

module.exports = startKeepAlive;
