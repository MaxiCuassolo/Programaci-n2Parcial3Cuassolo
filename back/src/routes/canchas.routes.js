// ============================================================
// Rutas de canchas
// ============================================================
const express = require("express");
const router = express.Router();

const { obtenerCanchas } = require("../controllers/canchas.controller");

// GET /api/canchas -> combo y lista de canchas
router.get("/", obtenerCanchas);

module.exports = router;
