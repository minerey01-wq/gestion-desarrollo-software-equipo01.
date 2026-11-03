const request = require("supertest");
const { test } = require("node:test");
const assert = require("node:assert");
const { createApp } = require("../src/app");

// Prueba del endpoint de salud
test("GET /health debe devolver estado activo", async () => {
    const redisFake = {
        incr: async () => 1
    };

    const app = createApp(redisFake);

    const response = await request(app).get("/health");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.status, "activo");
});

// Prueba del contador de visitas
test("GET /api/visitas debe incrementar el contador", async () => {
    let contador = 0;

    const redisFake = {
        incr: async () => ++contador
    };

    const app = createApp(redisFake);

    const response = await request(app).get("/api/visitas");

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.visitas, 1);
});

// Prueba del manejo de errores de Redis
test("Debe controlar errores de conexión con Redis", async () => {
    const redisFake = {
        incr: async () => {
            throw new Error("Redis no disponible");
        }
    };

    const app = createApp(redisFake);

    const response = await request(app).get("/api/visitas");

    assert.strictEqual(response.status, 503);
    assert.ok(response.body.mensaje);
});