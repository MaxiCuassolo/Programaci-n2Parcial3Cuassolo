# 🎾 Pádel El Rebote - Sistema de Gestión y Mostrador

Sistema integral de gestión de reservas y recaudación desarrollado para el Parcial 3 de Programación II.

## 🛠️ Tecnologías utilizadas
- **Base de datos:** Microsoft SQL Server Express (T-SQL, Restricciones, Integridad referencial y Procedimientos Almacenados).
- **Backend:** Node.js, Express, mssql, dotenv, cors.
- **Frontend:** HTML5, CSS3 moderno, Vanilla JavaScript (Fetch API).

---

## 🚀 Puesta en marcha

### 1. Base de datos
1. Abrir SQL Server Management Studio (SSMS).
2. Ejecutar el script `scriptPadelBD.sql` ubicado en la raíz del proyecto.
3. Se creará la base de datos `PadelDBCuassolo`, las tablas con restricciones (`UNIQUE`, `CHECK`), datos de prueba y los 5 procedimientos almacenados (`usp_`).

### 2. Backend (API REST)
1. Abrir una terminal y navegar a la carpeta `back`:
   ```bash
   cd back
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno:
   - Crear un archivo `.env` basado en `env.ejemplo`.
   - Ajustar las credenciales según tu servidor SQL Server.
4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   El servidor estará disponible en `http://localhost:3000`.

---

## 📡 Endpoints de la API

| Método | Endpoint | Descripción | Código Éxito |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/canchas` | Obtiene el listado de canchas con sus precios | 200 OK |
| **GET** | `/api/reservas` | Lista todas las reservas con nombre y precio de cancha (JOIN) | 200 OK |
| **POST** | `/api/reservas` | Registra una reserva `{ idCancha, cliente, fecha, hora }` | 201 Created |
| **PUT** | `/api/reservas/:id/pago` | Marca una reserva como pagada | 200 OK |
| **GET** | `/api/reportes/recaudacion` | Reporte por cancha con total cobrado y pendiente | 200 OK |

---

## 💻 Frontend
Abrir el archivo `front/index.html` en el navegador para acceder al mostrador interactivo.
