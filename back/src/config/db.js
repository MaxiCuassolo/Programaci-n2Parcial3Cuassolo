// ============================================================
// Configuración de la conexión a SQL Server Express
// Los valores sensibles NUNCA van en el código: se leen del .env
// ============================================================
const sql = require("mssql");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

// Un único pool de conexiones reutilizado por toda la app
let poolPromise = null;

function getConnection() {
  if (!poolPromise) {
    poolPromise = sql.connect(dbConfig).catch((error) => {
      poolPromise = null;
      throw error;
    });
  }
  return poolPromise;
}

module.exports = { sql, getConnection };
