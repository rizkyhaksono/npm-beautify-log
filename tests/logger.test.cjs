const test = require("node:test");
const assert = require("node:assert/strict");

const { createLogger } = require("../dist/index.cjs");

function captureConsole() {
  const original = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  const calls = {
    debug: [],
    info: [],
    warn: [],
    error: [],
  };

  console.debug = (message) => {
    calls.debug.push(String(message));
  };

  console.info = (message) => {
    calls.info.push(String(message));
  };

  console.warn = (message) => {
    calls.warn.push(String(message));
  };

  console.error = (message) => {
    calls.error.push(String(message));
  };

  return {
    calls,
    restore() {
      console.debug = original.debug;
      console.info = original.info;
      console.warn = original.warn;
      console.error = original.error;
    },
  };
}

test("debug aktif saat development", () => {
  const sink = captureConsole();

  const logger = createLogger({
    env: "development",
    timestamp: false,
    useColors: false,
  });

  logger.debug("debug hidup");

  sink.restore();

  assert.equal(sink.calls.debug.length, 1);
  assert.match(sink.calls.debug[0], /^DEBUG debug hidup$/);
});

test("debug nonaktif default saat production", () => {
  const sink = captureConsole();

  const logger = createLogger({
    env: "production",
    timestamp: false,
    useColors: false,
  });

  logger.debug("jangan tampil");
  logger.info("tetap tampil");

  sink.restore();

  assert.equal(sink.calls.debug.length, 0);
  assert.equal(sink.calls.info.length, 1);
  assert.match(sink.calls.info[0], /^INFO tetap tampil$/);
});

test("warn dan error pakai console method yang tepat", () => {
  const sink = captureConsole();

  const logger = createLogger({
    env: "development",
    timestamp: false,
    useColors: false,
  });

  logger.warn("peringatan");
  logger.error("gagal");

  sink.restore();

  assert.equal(sink.calls.warn.length, 1);
  assert.equal(sink.calls.error.length, 1);
  assert.match(sink.calls.warn[0], /^WARN peringatan$/);
  assert.match(sink.calls.error[0], /^ERROR gagal$/);
});

test("metadata object diformat rapi", () => {
  const sink = captureConsole();

  const logger = createLogger({
    env: "development",
    timestamp: false,
    useColors: false,
    prettyMeta: true,
  });

  logger.info("payload", { userId: 7, role: "admin" });

  sink.restore();

  assert.equal(sink.calls.info.length, 1);
  assert.match(sink.calls.info[0], /INFO payload/);
  assert.match(sink.calls.info[0], /"userId": 7/);
  assert.match(sink.calls.info[0], /"role": "admin"/);
});
