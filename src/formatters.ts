import { ANSI_RESET, LOG_LEVEL_COLOR, LOG_LEVEL_PRIORITY } from "./levels";
import type { LogLevel, LogPayload } from "./types";

function normalizeForJson(payload: LogPayload): unknown {
  if (payload instanceof Error) {
    return {
      name: payload.name,
      message: payload.message,
      stack: payload.stack,
    };
  }

  return payload;
}

function stringifyWithCircularGuard(payload: unknown, pretty: boolean): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(
    payload,
    (_key, value) => {
      if (typeof value === "bigint") {
        return `${value.toString()}n`;
      }

      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }

        seen.add(value);
      }

      return value;
    },
    pretty ? 2 : 0,
  );
}

export function stringifyMeta(meta: LogPayload, pretty: boolean): string {
  const normalized = normalizeForJson(meta);

  if (typeof normalized === "string") {
    return normalized;
  }

  if (normalized === undefined) {
    return "";
  }

  try {
    const result = stringifyWithCircularGuard(normalized, pretty);
    return result === undefined ? String(normalized) : result;
  } catch {
    return String(normalized);
  }
}

export function shouldUseColors(mode: boolean | "auto"): boolean {
  if (mode === true || mode === false) {
    return mode;
  }

  if (typeof process === "undefined") {
    return false;
  }

  if (process.env.NO_COLOR !== undefined) {
    return false;
  }

  if (process.env.FORCE_COLOR === "1" || process.env.FORCE_COLOR === "true") {
    return true;
  }

  return Boolean(process.stdout?.isTTY);
}

export function shouldLog(target: LogLevel, currentLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[target] >= LOG_LEVEL_PRIORITY[currentLevel];
}

export function defaultLevelByEnv(env: string): LogLevel {
  return env === "development" ? "debug" : "info";
}

export function formatTimestamp(locale: string, timeZone: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(new Date());
}

export function paintLevel(level: LogLevel, text: string): string {
  return `${LOG_LEVEL_COLOR[level]}${text}${ANSI_RESET}`;
}
