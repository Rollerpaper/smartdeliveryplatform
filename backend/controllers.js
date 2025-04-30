const bcrypt = require('bcryptjs');
const db = require('./db');
const pool = () => db.getPool();

// 用户登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool().query('SELECT * FROM users WHERE username=?', [username]);
  if (rows.length === 0) return res.status(401).json({ message: '用户名或密码错误' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: '用户名或密码错误' });
  res.json({ id: user.id, role: user.role });
};

// 注册
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await pool().query('INSERT INTO users(username,password,role) VALUES(?,?,?)', [username, hash, role||'customer']);
  res.json({ message: '注册成功' });
};

// 列出待审批商户
exports.listPendingMerchants = async (_, res) => {
  const [rows] = await pool().query('SELECT * FROM merchants WHERE approved=0');
  res.json(rows);
};

// 批准商户
exports.approveMerchant = async (req, res) => {
  await pool().query('UPDATE merchants SET approved=1 WHERE id=?', [req.params.id]);
  res.json({ message: '商户已批准' });
};

// 下单（支付简化，不集成 Stripe）
exports.createOrder = async (req, res) => {
  const { customerId, merchantId, amount } = req.body;
  const [r] = await pool().query(
    'INSERT INTO orders(customerId,merchantId,amount) VALUES(?,?,?)',
    [customerId, merchantId, amount]
  );
  res.json({ id: r.insertId });
};

// 列出司机待接订单
exports.listPendingOrders = async (_, res) => {
  const [rows] = await pool().query('SELECT * FROM orders WHERE status="pending"');
  res.json(rows);
};

// 司机接单
exports.acceptOrder = async (req, res) => {
  await pool().query('UPDATE orders SET status="accepted" WHERE id=?', [req.params.id]);
  res.json({ message: '订单已接单' });
};

// 提交评论
exports.submitReview = async (req, res) => {
  const { orderId, customerId, rating, comment } = req.body;
  await pool().query(
    'INSERT INTO reviews(orderId,customerId,rating,comment) VALUES(?,?,?,?)',
    [orderId, customerId, rating, comment]
  );
  res.json({ message: '评论提交成功' });
};

// 生成当日报表
exports.generateDailyReport = async (_, res) => {
  const today = new Date().toISOString().slice(0,10);
  const [rows] = await pool().query(
    'SELECT * FROM orders WHERE DATE(createdAt)=?', [today]
  );
  const totalOrders = rows.length;
  const totalRevenue = rows.reduce((sum,r)=> sum + parseFloat(r.amount), 0);
  res.json({ totalOrders, totalRevenue });
};

// 生成月报 & 列表
exports.generateMonthlyReport = async (_, res) => {
  const now = new Date();
  const period = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const [rows] = await pool().query(
    'SELECT * FROM orders WHERE DATE_FORMAT(createdAt, "%Y-%m")=?', [period]
  );
  const totalOrders = rows.length;
  const totalRevenue = rows.reduce((sum,r)=> sum + parseFloat(r.amount), 0);
  await pool().query(
    'INSERT INTO reports(period,totalRevenue,totalOrders) VALUES(?,?,?)',
    [period, totalRevenue, totalOrders]
  );
  res.json({ period, totalOrders, totalRevenue });
};
exports.listMonthlyReports = async (_, res) => {
  const [rows] = await pool().query('SELECT * FROM reports ORDER BY generatedAt DESC');
  res.json(rows);
};