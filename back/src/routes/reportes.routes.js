// ============================================================
// Rutas de reportes
// ============================================================
const express = require("express");
const router = express.Router();

const { obtenerRecaudacion } = require("../controllers/reportes.controller");

// GET /api/reportes/recaudacion -> reporte agrupado con ceros
router.get("/recaudacion", obtenerRecaudacion);

module.exports = router;
