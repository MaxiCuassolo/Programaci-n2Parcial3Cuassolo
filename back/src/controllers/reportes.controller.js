// ============================================================
// Controlador de reportes (Punto 12)
// "La base calcula, el back transporta, el front presenta"
// ============================================================
const { getConnection } = require("../config/db");

// GET /api/reportes/recaudacion
async function obtenerRecaudacion(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().execute("usp_RecaudacionPorCancha");
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener la recaudación", error: error.message });
  }
}

module.exports = { obtenerRecaudacion };
