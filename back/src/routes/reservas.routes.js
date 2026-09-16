// ============================================================
// Rutas de reservas
// ============================================================
const express = require("express");
const router = express.Router();

const { obtenerReservas, crearReserva, registrarPago } = require("../controllers/reservas.controller");

// GET /api/reservas          -> listado con join
router.get("/", obtenerReservas);

// POST /api/reservas         -> crear reserva (201)
router.post("/", crearReserva);

// PUT /api/reservas/:id/pago -> registrar pago
router.put("/:id/pago", registrarPago);

module.exports = router;
