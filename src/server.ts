import mongoose from "mongoose";
import app from  "./app";
import config from "./config/config";
import logger  from "./config/logger";

process.on("uncaughtException", err=>{
  console.log("Uncaught exception shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

//LISTEN
let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('⚡️ Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`⚡️ Server is running at http://localhost:${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});