// ============================================================
// Servidor principal de la API - Pádel El Rebote
// Parcial 3 - Programación II
// ============================================================
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const canchasRoutes = require("./routes/canchas.routes");
const reservasRoutes = require("./routes/reservas.routes");
const reportesRoutes = require("./routes/reportes.routes");

const app = express();

// Middlewares globales (Punto 11)
app.use(cors());
app.use(express.json());

// Rutas de la API (Punto 12)
app.use("/api/canchas", canchasRoutes);
app.use("/api/reservas", reservasRoutes);
app.use("/api/reportes", reportesRoutes);

// Ruta raíz de verificación
app.get("/", (req, res) => {
  res.send("API Complejo Pádel El Rebote funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
