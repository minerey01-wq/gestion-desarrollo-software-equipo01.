const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const { createApp } = require("../src/app");

async function startTestServer(redisClient) {
  const server = http.createServer(createApp(redisClient));
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  return {
    server,
    url: `http://127.0.0.1:${server.address().port}`
  };
}

test("GET /health responde activo", async () => {
  const { server, url } = await startTestServer({ incr: async () => 1 });
  try {
    const response = await fetch(`${url}/health`);
    const data = await response.json();
    assert.equal(response.status, 200);
    assert.equal(data.status, "activo");
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("GET /api/visitas incrementa contador", async () => {
  let contador = 0;
  const { server, url } = await startTestServer({
    incr: async () => ++contador
  });
  try {
    const first = await fetch(`${url}/api/visitas`);
    const second = await fetch(`${url}/api/visitas`);
    assert.equal((await first.json()).visitas, 1);
    assert.equal((await second.json()).visitas, 2);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("GET /api/visitas controla errores de Redis", async () => {
  const redis = {
    incr: async () => {
      throw new Error("Redis desconectado");
    }
  };
  const { server, url } = await startTestServer(redis);
  try {
    const response = await fetch(`${url}/api/visitas`);
    assert.equal(response.status, 503);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
