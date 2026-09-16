// ============================================================
// Controlador de reservas: creación y registro de pago.
// Traduce los números de THROW de SQL Server a códigos HTTP (Punto 13)
// ============================================================
const { sql, getConnection } = require("../config/db");

function esErrorDeNegocio(error) {
  return typeof error.number === "number" && error.number >= 50000;
}

// GET /api/reservas
async function obtenerReservas(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().execute("usp_ListarReservas");
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas", error: error.message });
  }
}

// POST /api/reservas   Body: { idCancha, cliente, fecha, hora }
async function crearReserva(req, res) {
  try {
    const { idCancha, cliente, fecha, hora } = req.body;

    if (!idCancha || !cliente || !fecha || !hora) {
      return res.status(400).json({ mensaje: "Debe completar todos los datos" });
    }

    const pool = await getConnection();
    const resultado = await pool.request()
      .input("IdCancha", sql.Int, Number(idCancha))
      .input("Cliente", sql.NVarChar(100), cliente.trim())
      .input("Fecha", sql.Date, fecha)
      .input("Hora", sql.NVarChar(5), hora.trim())
      .execute("usp_CrearReserva");

    // 201 en el alta (Punto 13)
    res.status(201).json({
      mensaje: "Reserva registrada correctamente",
      idReserva: resultado.recordset[0].idReserva
    });
  } catch (error) {
    // 404 para 50002 (Cancha inexistente)
    if (error.number === 50002) {
      return res.status(404).json({ mensaje: error.message });
    }
    // 400 para reglas de negocio (50003 cliente vacío, 50011 horario ocupado)
    if (esErrorDeNegocio(error)) {
      return res.status(400).json({ mensaje: error.message });
    }
    // 500 técnico
    res.status(500).json({ mensaje: "Error al registrar la reserva", error: error.message });
  }
}

// PUT /api/reservas/:id/pago
async function registrarPago(req, res) {
  try {
    // El id de la URL se valida con Number() (Punto 13)
    const idReserva = Number(req.params.id);

    if (isNaN(idReserva) || idReserva <= 0) {
      return res.status(400).json({ mensaje: "El ID de la reserva no es válido" });
    }

    const pool = await getConnection();
    await pool.request()
      .input("IdReserva", sql.Int, idReserva)
      .execute("usp_RegistrarPago");

    res.json({
      mensaje: "Pago registrado correctamente",
      idReserva: idReserva
    });
  } catch (error) {
    // 404 para 50002 (Reserva inexistente)
    if (error.number === 50002) {
      return res.status(404).json({ mensaje: error.message });
    }
    // 400 para 50008 (Ya estaba pagada)
    if (esErrorDeNegocio(error)) {
      return res.status(400).json({ mensaje: error.message });
    }
    // 500 técnico
    res.status(500).json({ mensaje: "Error al registrar el pago", error: error.message });
  }
}

module.exports = { obtenerReservas, crearReserva, registrarPago };
