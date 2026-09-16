// ============================================================
// Controlador de canchas
// ============================================================
const { getConnection } = require("../config/db");

// GET /api/canchas
async function obtenerCanchas(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().execute("usp_ListarCanchas");
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener canchas", error: error.message });
  }
}

module.exports = { obtenerCanchas };
