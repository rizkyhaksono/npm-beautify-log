# @rizkyhaksono/npm-beautify-log

Beautified logger untuk Next.js dengan TypeScript.

Fitur utama:
- level log: `info`, `debug`, `warn`, `error`
- output rapi dengan timestamp lokal
- warna otomatis untuk terminal yang mendukung ANSI
- aman untuk SSR dan CI (auto fallback tanpa warna)
- tanpa runtime dependency

## Install

```bash
npm install @rizkyhaksono/npm-beautify-log
```

## Quick Start

```ts
import { logger } from "@rizkyhaksono/npm-beautify-log";

logger.info("Server ready", { port: 3000 });
logger.debug("Payload", { id: 42 });
logger.warn("Cache miss");
logger.error("Query failed", new Error("DB timeout"));
```

## Custom Logger

```ts
import { createLogger } from "@rizkyhaksono/npm-beautify-log";

const appLogger = createLogger({
  env: process.env.NODE_ENV,
  timestamp: true,
  timestampLocale: "id-ID",
  timestampTimeZone: "Asia/Jakarta",
  useColors: "auto",
  prettyMeta: true,
  prefix: "[my-next-app]",
});

appLogger.info("Booting app");
```

## Opsi Konfigurasi

- `level`: level minimum log (`debug` | `info` | `warn` | `error`)
- `useColors`: `true`, `false`, atau `"auto"`
- `timestamp`: aktif/nonaktif timestamp
- `timestampLocale`: default `id-ID`
- `timestampTimeZone`: default `Asia/Jakarta`
- `env`: untuk default level (`development` => `debug`, selain itu `info`)
- `prettyMeta`: pretty print metadata JSON
- `prefix`: prefix text tambahan di awal log

## Contoh di Next.js

### App Router - Server

```ts
// app/api/health/route.ts
import { logger } from "@rizkyhaksono/npm-beautify-log";

export async function GET() {
  logger.info("Health endpoint called");
  return Response.json({ ok: true });
}
```

### Client Component

```tsx
"use client";

import { logger } from "@rizkyhaksono/npm-beautify-log";
import { useEffect } from "react";

export function ExampleClient() {
  useEffect(() => {
    logger.debug("Client mounted");
  }, []);

  return <div>Check console</div>;
}
```

## Development

```bash
npm run lint
npm run build
npm test
```