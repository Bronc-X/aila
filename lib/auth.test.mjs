import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function importAuthModule(cacheKey) {
  const source = await readFile(new URL("./auth.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return import(
    `data:text/javascript;charset=utf-8,${encodeURIComponent(`${outputText}\n//# sourceURL=auth.${cacheKey}.mjs`)}`
  );
}

test("falls back to documented invite codes when env vars are missing", async () => {
  const originalToolsCode = process.env.AILA_LOGIN_INVITE_CODE;
  const originalSlidesCode = process.env.AILA_SLIDES_INVITE_CODE;

  delete process.env.AILA_LOGIN_INVITE_CODE;
  delete process.env.AILA_SLIDES_INVITE_CODE;

  try {
    const auth = await importAuthModule(`fallback-${Date.now()}`);

    assert.equal(auth.getInviteScope("2026"), "tools");
    assert.equal(auth.getInviteScope("2049"), "slides");
  } finally {
    if (originalToolsCode === undefined) {
      delete process.env.AILA_LOGIN_INVITE_CODE;
    } else {
      process.env.AILA_LOGIN_INVITE_CODE = originalToolsCode;
    }

    if (originalSlidesCode === undefined) {
      delete process.env.AILA_SLIDES_INVITE_CODE;
    } else {
      process.env.AILA_SLIDES_INVITE_CODE = originalSlidesCode;
    }
  }
});

test("keeps documented invite codes valid when env vars drift", async () => {
  const originalToolsCode = process.env.AILA_LOGIN_INVITE_CODE;
  const originalSlidesCode = process.env.AILA_SLIDES_INVITE_CODE;

  process.env.AILA_LOGIN_INVITE_CODE = "2016";
  process.env.AILA_SLIDES_INVITE_CODE = "9999";

  try {
    const auth = await importAuthModule(`drift-${Date.now()}`);

    assert.equal(auth.getInviteScope("2026"), "tools");
    assert.equal(auth.getInviteScope("2016"), "tools");
    assert.equal(auth.getInviteScope("2049"), "slides");
    assert.equal(auth.getInviteScope("9999"), "slides");
  } finally {
    if (originalToolsCode === undefined) {
      delete process.env.AILA_LOGIN_INVITE_CODE;
    } else {
      process.env.AILA_LOGIN_INVITE_CODE = originalToolsCode;
    }

    if (originalSlidesCode === undefined) {
      delete process.env.AILA_SLIDES_INVITE_CODE;
    } else {
      process.env.AILA_SLIDES_INVITE_CODE = originalSlidesCode;
    }
  }
});

test("can create and verify a session token when the session secret is not configured", async () => {
  const originalSecret = process.env.AILA_SESSION_SECRET;

  delete process.env.AILA_SESSION_SECRET;

  try {
    const auth = await importAuthModule(`secret-${Date.now()}`);
    const token = auth.createSessionToken({
      inviteCodes: ["2026"],
      scopes: ["tools"],
    });

    assert.equal(auth.verifySessionToken(token)?.scopes.includes("tools"), true);
  } finally {
    if (originalSecret === undefined) {
      delete process.env.AILA_SESSION_SECRET;
    } else {
      process.env.AILA_SESSION_SECRET = originalSecret;
    }
  }
});
