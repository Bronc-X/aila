import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import Module from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const routePath = new URL("../../app/api/learning/feynman/route.ts", import.meta.url);

function jsonResponse(body, init = {}) {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

async function importRoute({
  env = {},
  fetchImpl = async () => jsonResponse({ output_text: "默认解释" }),
  session = { scopes: ["slides"] },
} = {}) {
  const source = await readFile(routePath, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  });

  const exports = {};
  const cjsModule = { exports };
  const baseRequire = Module.createRequire(import.meta.url);
  const mocks = {
    "next/server": {
      NextResponse: {
        json: jsonResponse,
      },
    },
    "@/lib/auth": {
      getSessionFromRequest: () => session,
      sessionHasScope: (value, scope) => Boolean(value?.scopes?.includes(scope)),
    },
  };
  const requireWithMocks = (specifier) =>
    specifier in mocks ? mocks[specifier] : baseRequire(specifier);
  const context = vm.createContext({
    AbortSignal,
    DOMException,
    Headers,
    Request,
    Response,
    TextDecoder,
    URL,
    clearTimeout,
    console: {
      error() {},
    },
    exports,
    fetch: fetchImpl,
    module: cjsModule,
    process: {
      env: {
        AI_LEARNING_OPENAI_API_KEY: "test-key",
        AI_LEARNING_OPENAI_BASE_URL: "https://testvideo.site/v1",
        AI_LEARNING_OPENAI_MODEL: "gpt-5.5",
        ...env,
      },
    },
    require: requireWithMocks,
    setTimeout,
  });
  const script = new vm.Script(outputText, {
    filename: `feynman-route.${Date.now()}-${Math.random()}.cjs`,
  });

  script.runInContext(context);
  return cjsModule.exports;
}

function createRequest(body, headers = {}) {
  return new Request("http://localhost/api/learning/feynman", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.7",
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function readJson(response) {
  return JSON.parse(await response.text());
}

test("rejects an unauthenticated request before calling the model", async () => {
  let calls = 0;
  const route = await importRoute({
    session: null,
    fetchImpl: async () => {
      calls += 1;
      return jsonResponse({ output_text: "不应调用" });
    },
  });

  const response = await route.POST(createRequest({ selection: "注意力机制" }));

  assert.equal(response.status, 401);
  assert.equal(calls, 0);
});

test("requires the slides scope inside the route handler", async () => {
  const route = await importRoute({ session: { scopes: ["tools"] } });

  const response = await route.POST(createRequest({ selection: "注意力机制" }));

  assert.equal(response.status, 403);
});

test("rejects malformed, empty, and oversized selections", async () => {
  const route = await importRoute();

  const malformed = await route.POST(createRequest("{"));
  const empty = await route.POST(createRequest({ selection: "   " }));
  const oversized = await route.POST(createRequest({ selection: "a".repeat(4001) }));

  assert.equal(malformed.status, 400);
  assert.equal(empty.status, 400);
  assert.equal(oversized.status, 413);
});

test("calls the Responses API with the required GPT-5.5 Feynman contract", async () => {
  let capturedUrl = "";
  let capturedInit;
  const route = await importRoute({
    fetchImpl: async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return jsonResponse({
        output_text:
          "痛点源头\n旧方法看不清关系。\n\n物理齿轮\n注意力权重重新分配信息。\n\n确切变化\n输出会聚合相关 token。\n\n前提补充/盲点\n权重高不等于因果。",
      });
    },
  });

  const response = await route.POST(
    createRequest({
      selection: "Self-attention lets each token attend to other tokens.",
      contextTitle: "Transformer 原理",
      sourceKind: "study",
    })
  );
  const payload = await readJson(response);
  const upstreamBody = JSON.parse(capturedInit.body);

  assert.equal(response.status, 200);
  assert.equal(route.maxDuration, 300);
  assert.equal(
    response.headers.get("Content-Type"),
    "application/json; charset=utf-8"
  );
  assert.match(payload.explanation, /痛点源头/);
  assert.equal(capturedUrl, "https://testvideo.site/v1/responses");
  assert.equal(capturedInit.headers.Authorization, "Bearer test-key");
  assert.equal(capturedInit.headers.Accept, "text/event-stream");
  assert.equal(upstreamBody.model, "gpt-5.5");
  assert.equal(upstreamBody.store, false);
  assert.equal(upstreamBody.max_output_tokens, 1600);
  assert.equal(upstreamBody.stream, true);
  assert.match(capturedInit.body, /\\u/);
  assert.deepEqual(upstreamBody.reasoning, { effort: "xhigh" });
  assert.match(upstreamBody.instructions, /痛点源头/);
  assert.match(upstreamBody.instructions, /物理齿轮/);
  assert.match(upstreamBody.instructions, /确切变化/);
  assert.match(upstreamBody.instructions, /前提补充\/盲点/);
  assert.match(upstreamBody.input, /Transformer 原理/);
  assert.match(upstreamBody.input, /Self-attention/);
});

test("extracts text from Responses output content when output_text is absent", async () => {
  const route = await importRoute({
    fetchImpl: async () =>
      jsonResponse({
        output: [
          {
            content: [
              { type: "output_text", text: "痛点源头\n补充解释" },
              { type: "refusal", refusal: "ignored" },
            ],
          },
        ],
      }),
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.explanation, "痛点源头\n补充解释");
});

test("normalizes markdown around Feynman headings before returning the answer", async () => {
  const route = await importRoute({
    fetchImpl: async () =>
      jsonResponse({
        output_text: "**痛点源头**\n说明问题。\n\n### 物理齿轮\n说明过程。",
      }),
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.explanation, "痛点源头\n说明问题。\n\n物理齿轮\n说明过程。");
});

test("collects output text deltas from the Responses streaming API", async () => {
  const streamBody = [
    `event: response.output_text.delta\ndata: ${JSON.stringify({
      type: "response.output_text.delta",
      delta: "痛点源头\n",
    })}`,
    `event: response.output_text.delta\ndata: ${JSON.stringify({
      type: "response.output_text.delta",
      delta: "只解释选中的内容。",
    })}`,
    `event: response.output_text.done\ndata: ${JSON.stringify({
      type: "response.output_text.done",
      text: "痛点源头\n只解释选中的内容。",
    })}`,
    `event: response.completed\ndata: ${JSON.stringify({
      type: "response.completed",
      response: { output_text: "fallback" },
    })}`,
  ].join("\n\n") + "\n\n";
  const route = await importRoute({
    fetchImpl: async () =>
      new Response(streamBody, {
        headers: { "Content-Type": "text/event-stream" },
      }),
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));
  const payload = await readJson(response);

  assert.equal(response.status, 200);
  assert.equal(payload.explanation, "痛点源头\n只解释选中的内容。");
});

test("returns controlled errors without leaking upstream response bodies", async () => {
  const route = await importRoute({
    fetchImpl: async () =>
      new Response("internal provider trace with secret detail", { status: 500 }),
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));
  const payload = await readJson(response);

  assert.equal(response.status, 502);
  assert.equal(payload.error, "AI_UPSTREAM_ERROR");
  assert.doesNotMatch(payload.message, /secret detail/);
});

test("returns a controlled configuration error when the server key is missing", async () => {
  const route = await importRoute({
    env: {
      AI_LEARNING_OPENAI_API_KEY: "",
    },
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));
  const payload = await readJson(response);

  assert.equal(response.status, 503);
  assert.equal(payload.error, "AI_NOT_CONFIGURED");
});

test("reuses the existing server-only OpenAI key when learning-specific config is absent", async () => {
  let capturedUrl = "";
  let capturedAuthorization = "";
  const route = await importRoute({
    env: {
      AI_LEARNING_OPENAI_API_KEY: "",
      AI_LEARNING_OPENAI_BASE_URL: "",
      OPENAI_API_KEY: "shared-server-key",
      OPENAI_BASE_URL: "",
    },
    fetchImpl: async (url, init) => {
      capturedUrl = String(url);
      capturedAuthorization = init.headers.Authorization;
      return jsonResponse({ output_text: "痛点源头\n复用项目已有的服务端配置。" });
    },
  });

  const response = await route.POST(createRequest({ selection: "RAG" }));

  assert.equal(response.status, 200);
  assert.equal(capturedUrl, "https://testvideo.site/v1/responses");
  assert.equal(capturedAuthorization, "Bearer shared-server-key");
});

test("rate limits repeated model calls and returns Retry-After", async () => {
  const route = await importRoute();
  let response;

  for (let index = 0; index < 11; index += 1) {
    response = await route.POST(createRequest({ selection: `RAG ${index}` }));
  }

  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
});
