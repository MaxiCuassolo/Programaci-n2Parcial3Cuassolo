// ============================================================
// Front - Pádel El Rebote (Parcial 3 - Programación II)
// Sección D: Combos poblados (14), Tarjetas con estado y pago (15),
// Tabla de recaudación con montos pendientes en rojo (16).
// ============================================================
const API_URL = "http://localhost:3000/api";

// Elementos del DOM
const formReserva = document.querySelector("#formReserva");
const inputCliente = document.querySelector("#cliente");
const selectCancha = document.querySelector("#cancha");
const inputFecha = document.querySelector("#fecha");
const inputHora = document.querySelector("#hora");
const mensaje = document.querySelector("#mensaje");
const listadoReservas = document.querySelector("#listadoReservas");
const cuerpoRecaudacion = document.querySelector("#tablaRecaudacion tbody");

// Formateador de moneda argentina
const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

// ------------------------------------------------------------
// 14. Cargar Canchas en el Combo del formulario
// ------------------------------------------------------------
async function cargarCanchas() {
    try {
        const respuesta = await fetch(`${API_URL}/canchas`);
        if (!respuesta.ok) throw new Error("Error al obtener canchas");

        const canchas = await respuesta.json();

        selectCancha.innerHTML = '<option value="">Seleccione una cancha</option>';
        canchas.forEach(cancha => {
            selectCancha.innerHTML += `
                <option value="${cancha.idCancha}">
                    ${cancha.nombre} — ${formatoPrecio.format(cancha.precioPorHora)}/h
                </option>
            `;
        });
    } catch (error) {
        selectCancha.innerHTML = '<option value="">No se pudieron cargar las canchas</option>';
        console.error(error);
    }
}


async function cargarReservas() {
    try {
        const respuesta = await fetch(`${API_URL}/reservas`);
        if (!respuesta.ok) throw new Error("Error al obtener reservas");

        const reservas = await respuesta.json();

        listadoReservas.innerHTML = "";

        if (reservas.length === 0) {
            listadoReservas.innerHTML = '<p class="sin-resultados">No hay reservas registradas.</p>';
            return;
        }

        reservas.forEach(reserva => {
            const estaPagada = reserva.pagada === 1 || reserva.pagada === true;
            const fechaLimpia = reserva.fecha.split("T")[0];

            listadoReservas.innerHTML += `
                <div class="tarjeta-reserva">
                    <div class="tarjeta-header">
                        <span class="tarjeta-cliente">${reserva.cliente}</span>
                        <span class="chip ${estaPagada ? "pagada" : "pendiente"}">
                            ${estaPagada ? "Pagada" : "Pendiente"}
                        </span>
                    </div>
                    <div class="tarjeta-cancha">
                            <strong>${reserva.cancha}</strong> (${formatoPrecio.format(reserva.precioPorHora)})
                    </div>
                    <div class="tarjeta-horario">
                            ${fechaLimpia} —  ${reserva.hora} hs
                    </div>
                    ${
                        !estaPagada
                            ? `<button class="btn-pagar" onclick="pagarReserva(${reserva.idReserva})">Registrar pago</button>`
                            : ""
                    }
                </div>
            `;
        });
    } catch (error) {
        listadoReservas.innerHTML = '<p class="sin-resultados">Error al cargar reservas.</p>';
        console.error(error);
    }
}

// ------------------------------------------------------------
// 16. Tabla de Recaudación por Cancha
// Agrupado con ceros garantizados y monto pendiente en rojo
// ------------------------------------------------------------
async function cargarRecaudacion() {
    try {
        const respuesta = await fetch(`${API_URL}/reportes/recaudacion`);
        if (!respuesta.ok) throw new Error("Error al obtener recaudación");

        const filas = await respuesta.json();

        cuerpoRecaudacion.innerHTML = "";
        filas.forEach(fila => {
            cuerpoRecaudacion.innerHTML += `
                <tr>
                    <td><strong>${fila.cancha}</strong></td>
                    <td class="numero">${fila.cantidadReservas}</td>
                    <td class="numero">${formatoPrecio.format(fila.totalCobrado)}</td>
                    <td class="numero rojo">${formatoPrecio.format(fila.totalPendiente)}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
    }
}

// ------------------------------------------------------------
// 14. POST: Crear nueva reserva
// Si falla por regla de negocio (50002, 50003, 50011), se muestra el error de SQL
// ------------------------------------------------------------
async function crearReserva(evento) {
    evento.preventDefault();

    const nuevaReserva = {
        cliente: inputCliente.value.trim(),
        idCancha: Number(selectCancha.value),
        fecha: inputFecha.value,
        hora: inputHora.value.trim()
    };

    if (!nuevaReserva.cliente || !nuevaReserva.idCancha || !nuevaReserva.fecha || !nuevaReserva.hora) {
        mostrarMensaje("Debe completar todos los datos.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaReserva)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje);
        }

        mostrarMensaje("Reserva registrada correctamente.", "ok");
        formReserva.reset();
        cargarTodo(); // Recalcula tarjetas y recaudación en vivo
    } catch (error) {
        mostrarMensaje(`Error: ${error.message}`, "error");
        console.error(error);
    }
}

// ------------------------------------------------------------
// 15. PUT: Registrar pago de una reserva pendiente
// ------------------------------------------------------------
async function pagarReserva(idReserva) {
    try {
        const respuesta = await fetch(`${API_URL}/reservas/${idReserva}/pago`, {
            method: "PUT"
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje);
        }

        mostrarMensaje("Pago registrado correctamente.", "ok");
        cargarTodo(); // Actualiza el estado visual a pagada y la tabla de recaudación
    } catch (error) {
        mostrarMensaje(`Error: ${error.message}`, "error");
        console.error(error);
    }
}

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    mensaje.style.display = "block";

    setTimeout(() => {
        mensaje.style.display = "none";
    }, 5000);
}

function cargarTodo() {
    cargarCanchas();
    cargarReservas();
    cargarRecaudacion();
}

// Inicialización de eventos
formReserva.addEventListener("submit", crearReserva);
cargarTodo();
