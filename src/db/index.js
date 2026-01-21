import pg from 'pg';

const { Pool } = pg;

export const connectDatabase = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.DB_POOL_MAX || 10)
  });

  await pool.query('SELECT 1');
  return pool;
};
