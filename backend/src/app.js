const express = require("express");
const { createClient } = require("redis");

function createApp(redisClient) {
    const app = express();

    app.use(express.json());

    // Endpoint para comprobar el estado del servidor
    app.get("/health", (req, res) => {
        res.json({
            status: "activo"
        });
    });

    // Endpoint para registrar y consultar visitas
    app.get("/api/visitas", async (req, res) => {
        try {
            const visitas = await redisClient.incr("contador_visitas");

            res.json({
                mensaje: "Consulta realizada correctamente",
                visitas: visitas
            });

        } catch (error) {
            console.error("Error al consultar Redis:", error.message);

            res.status(503).json({
                mensaje: "No se pudo conectar con el servicio de visitas"
            });
        }
    });

    return app;
}

// Iniciar el servidor
async function iniciarServidor() {
    const redisClient = createClient({
        url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    redisClient.on("error", (error) => {
        console.error("Error de Redis:", error.message);
    });

    try {
        await redisClient.connect();
        console.log("Conectado correctamente a Redis");
    } catch (error) {
        console.error("No se pudo conectar con Redis:", error.message);
    }

    const app = createApp(redisClient);
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Servidor activo en el puerto ${PORT}`);
    });
}

if (require.main === module) {
    iniciarServidor();
}

module.exports = { createApp };