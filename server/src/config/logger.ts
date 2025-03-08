import envConfig from "@/config/env";
import { createLogger, format, transports } from "winston";

const customFormat = format((info) => {
  if (info.raw) {
    delete info.service;
    delete info.timestamp;
    delete info.raw;
  }

  return info;
})();

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    customFormat,
    format.json()
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

if (envConfig?.env !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple(), customFormat),
    })
  );
}

export default logger;
