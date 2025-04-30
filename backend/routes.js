const express = require('express');
const router = express.Router();
const ctrl = require('./controllers');

// 用户注册/登录
router.post('/register', ctrl.register);
router.post('/login',    ctrl.login);

// 商户审批
router.get ( '/merchants/pending',         ctrl.listPendingMerchants );
router.post('/merchant/approve/:id',       ctrl.approveMerchant );

// 订单
router.post('/order',                     ctrl.createOrder );
router.get ('/orders/pending',            ctrl.listPendingOrders );
router.post('/order/accept/:id',          ctrl.acceptOrder );

// 评论
router.post('/review',                    ctrl.submitReview );

// 报表
router.get ('/report/daily',              ctrl.generateDailyReport );
router.post('/report/monthly',            ctrl.generateMonthlyReport );
router.get ('/reports',                   ctrl.listMonthlyReports );

module.exports = router;