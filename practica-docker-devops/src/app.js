const express = require("express");
const { createClient } = require("redis");

function createApp(redisClient) {
  const app = express();

  app.get("/", (req, res) => {
    res.send("<h1>Control de visitas</h1>");
  });

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "activo" });
  });

  app.get("/api/visitas", async (req, res) => {
    try {
      const visitas = await redisClient.incr("visitas");
      res.json({ visitas });
    } catch (error) {
      res.status(503).json({
        error: "Servicio de visitas temporalmente no disponible"
      });
    }
  });

  return app;
}

async function startServer() {
  const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
  });

  redisClient.on("error", () => {
    console.error("Error de conexión con Redis");
  });

  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis no está disponible al iniciar");
  }

  const app = createApp(redisClient);
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor activo en puerto ${PORT}`);
  });
}

if (require.main === module) startServer();

module.exports = { createApp };
