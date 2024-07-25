/**
 * @name:adminRouter
 * @description:用户路由请求处理
 *
 * */
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const {doLogin} = require("../server/blog");
const {mysqlConn} = require('../mysql/mysql');
router.post("/login", async (req, res) => {
// body请求参数
	const {account, password} = req.body;
	// rows是数组变量
	const rows = await doLogin([account, password]);
	console.log("testing", rows);// 查询的结果
	// 1.登录成功判断
	if (rows.length > 0) {
		// 2.使用uuid生成token
		const admin_token = uuidv4();
		const admin_id = rows[0].id;
		// 3.将生成的token存入数据库
		const sql = "update `admin` set `account`=? where `id`=?";
		await mysqlConn(sql, [account, admin_id]);// 依据更新admin表
		// 4.将token返回给前端
		let admin_info = rows[0];// 第一请求来的数据，token还是空的
		admin_info.token = admin_token;
		// 5.将返回给前端的密码置空，避免密码返回给前端
		admin_info.password = "";
		res.send({
			code: 200,
			message: "登录成功！",
			data: admin_info
		})
	} else {
		res.send({
			code: 500,
			message: "登录失败了"
		})
	}

})
module.exports = router;
