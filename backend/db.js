// 负责连接池 & 表的自动创建
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;
async function init() {
  pool = await mysql.createPool({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });
  // 自动建表
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer','admin','driver','merchant') NOT NULL DEFAULT 'customer'
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS merchants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100),
      approved BOOLEAN DEFAULT FALSE
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customerId INT,
      merchantId INT,
      amount DECIMAL(10,2),
      status ENUM('pending','accepted','delivered') DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES users(id),
      FOREIGN KEY (merchantId) REFERENCES merchants(id)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      orderId INT,
      customerId INT,
      rating INT,
      comment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (customerId) REFERENCES users(id)
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      period VARCHAR(7),
      totalRevenue DECIMAL(12,2),
      totalOrders INT,
      generatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
function getPool() {
  if (!pool) throw new Error('DB not initialized');
  return pool;
}

module.exports = { init, getPool };