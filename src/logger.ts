import { LOG_LEVEL_LABEL } from "./levels";
import {
  defaultLevelByEnv,
  formatTimestamp,
  paintLevel,
  shouldLog,
  shouldUseColors,
  stringifyMeta,
} from "./formatters";
import type { Logger, LoggerOptions, LogLevel, LogPayload } from "./types";

const DEFAULT_TIME_ZONE = "Asia/Jakarta";
const DEFAULT_LOCALE = "id-ID";

export class BeautifyLogger implements Logger {
  private currentLevel: LogLevel;
  private readonly env: string;
  private readonly timestamp: boolean;
  private readonly timestampLocale: string;
  private readonly timestampTimeZone: string;
  private readonly prettyMeta: boolean;
  private readonly prefix: string;
  private readonly useColors: boolean;

  constructor(options: LoggerOptions = {}) {
    this.env =
      options.env ??
      (typeof process !== "undefined" ? process.env.NODE_ENV ?? "development" : "development");

    this.currentLevel = options.level ?? defaultLevelByEnv(this.env);
    this.timestamp = options.timestamp ?? true;
    this.timestampLocale = options.timestampLocale ?? DEFAULT_LOCALE;
    this.timestampTimeZone = options.timestampTimeZone ?? DEFAULT_TIME_ZONE;
    this.prettyMeta = options.prettyMeta ?? true;
    this.prefix = options.prefix?.trim() ?? "";
    this.useColors = shouldUseColors(options.useColors ?? "auto");
  }

  public setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }

  public debug(message: string, meta?: LogPayload): void {
    this.emit("debug", message, meta);
  }

  public info(message: string, meta?: LogPayload): void {
    this.emit("info", message, meta);
  }

  public warn(message: string, meta?: LogPayload): void {
    this.emit("warn", message, meta);
  }

  public error(message: string, meta?: LogPayload): void {
    this.emit("error", message, meta);
  }

  private emit(level: LogLevel, message: string, meta?: LogPayload): void {
    if (!shouldLog(level, this.currentLevel)) {
      return;
    }

    const line = this.composeLine(level, message, meta);

    switch (level) {
      case "debug":
        console.debug(line);
        return;
      case "warn":
        console.warn(line);
        return;
      case "error":
        console.error(line);
        return;
      default:
        console.info(line);
    }
  }

  private composeLine(level: LogLevel, message: string, meta?: LogPayload): string {
    const parts: string[] = [];

    if (this.timestamp) {
      parts.push(`[${formatTimestamp(this.timestampLocale, this.timestampTimeZone)}]`);
    }

    const levelLabel = LOG_LEVEL_LABEL[level];
    parts.push(this.useColors ? paintLevel(level, levelLabel) : levelLabel);

    if (this.prefix) {
      parts.push(this.prefix);
    }

    parts.push(message);

    if (meta === undefined) {
      return parts.join(" ");
    }

    const serializedMeta = stringifyMeta(meta, this.prettyMeta);
    if (!serializedMeta) {
      return parts.join(" ");
    }

    return `${parts.join(" ")} ${serializedMeta}`;
  }
}

export function createLogger(options: LoggerOptions = {}): BeautifyLogger {
  return new BeautifyLogger(options);
}

export const logger = createLogger();
