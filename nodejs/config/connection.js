import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
console.log("User:", process.env.DB_USER)
console.log("Host:", process.env.DB_HOST)
console.log("Database:", process.env.DB_NAME)
console.log("Password:", process.env.DB_PASSWORD)
console.log("Port:", process.env.DB_PORT)
// ✅ Test connection on startup
pool.connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

export default pool;