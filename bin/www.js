#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable no-declare-module */

/**
 * Module dependencies.
 */

// @ts-ignore
const tsApp = require("../dist/app");
const debug = require("debug")("express:server");
const http = require("http");

/**
 * Starts the express server. We do this asynchronously because starting the actual Express app is now
 * asynchronous.
 *
 */
async function startServer() {
  /**
   * Normalize a port into a number, string, or false.
   */

  function normalizePort(val) {
    const normalizedPort = parseInt(val, 10);

    if (isNaN(normalizedPort)) {
      // named pipe
      return val;
    }

    if (normalizedPort >= 0) {
      // port number
      return normalizedPort;
    }

    return false;
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        // eslint-disable-next-line no-console
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        // eslint-disable-next-line no-console
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    debug(`Listening on ${bind}`);
  }

  const app = await tsApp.startAsyncApp();

  /**
   * Create HTTP server.
   */

  const server = http.createServer(app);

  /**
   * Get port from the configuration and store in Express.
   */

  const port = normalizePort(tsApp.port || "3000");
  app.set("port", port);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);

  function stop() {
    server.close();
  }

  function stopConfig() {
    app.config.stopWatching();
  }

  module.exports = server;
  module.exports.stop = stop;
  module.exports.stopConfig = stopConfig;
}

startServer();
