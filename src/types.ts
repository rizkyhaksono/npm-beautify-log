export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogPayload = unknown;

export interface LoggerOptions {
  level?: LogLevel;
  useColors?: boolean | "auto";
  timestamp?: boolean;
  timestampLocale?: string;
  timestampTimeZone?: string;
  env?: string;
  prettyMeta?: boolean;
  prefix?: string;
}

export interface Logger {
  debug(message: string, meta?: LogPayload): void;
  info(message: string, meta?: LogPayload): void;
  warn(message: string, meta?: LogPayload): void;
  error(message: string, meta?: LogPayload): void;
  setLevel(level: LogLevel): void;
}
