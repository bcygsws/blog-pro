/**
 *
 * @name:
 * @description:
 *
 *
 * */
const {Query} = require("../mysql/mysql");
// 用以以简单方式产生token
const {v4: uuidv4} = require('uuid');
// 雪花切片算法产生随即的id
// 1.获取类模块
const GenId = require('../utils/SnowFlake');
// 2.实例化对象，在需要出调用产生id的方法
const genid = new GenId({WorkerId: 1});
// jwt插件产生token
const jwt = require('jsonwebtoken');
const {SECRET_KEY, expiresIn} = require("../config/config");
/**
 * @登录路由
 * http://localhost:8081/login
 * body参数
 * account:string
 * password:string
 *
 * */
exports.loginService = async (req, res) => {
	// body请求参数
	const {account, password} = req.body;
	// rows是数组变量
	const sql = "select * from `admin` where `account`=? and `password`=? ";
	const rows = await Query(sql, [account, password]);
	console.log("testing", rows);// 查询的结果
	// 1.登录成功判断
	//
	// 方案一：简单使用uuid生成了token,安全性低
	// if (rows.length > 0) {
	// 	// 2.使用uuid生成token
	// 	const admin_token = uuidv4();
	// 	const admin_id = rows[0].id;
	// 	// 3.将生成的token存入数据库
	// 	const sql = "update `admin` set `token`=? where `id`=?";
	// 	// 4.根据当前条数据的id,更新token值
	// 	await Query(sql, [admin_token, admin_id]);// 依据更新admin表
	// 	// 5.将token返回给前端
	// 	let admin_info = rows[0];// 第一请求来的数据，token还是空的
	// 	admin_info.token = admin_token;
	// 	// 6.将返回给前端的密码置空，避免密码返回给前端
	// 	admin_info.password = "";
	// 	res.send({
	// 		code: 200,
	// 		message: "登录成功！",
	// 		data: admin_info
	// 	})
	// } else {
	// 	res.send({
	// 		code: 500,
	// 		message: "登录失败了"
	// 	})
	// }

// 方案二：使用jwt生成token
	if (rows.length > 0) {// 表示后端提交的body用户名和密码参数，在数据库中能够查询到
		// 获取当前登录记录的id值，存储token到数据库时，需要使用id值
		const admin_id = rows[0].id;
		// 2.1 使用jwt生成token
		const rules = {
			id: admin_id,
			account: rows[0].account,
			password: rows[0].password
		}
		const token = jwt.sign(rules, SECRET_KEY, {expiresIn: expiresIn});
		// 将token值更新到数据库中
		const sql = "update `admin` set `token`=? where `id`=?";
		await Query(sql, [token, admin_id]);
		res.send({
			code: 200,
			message: '恭喜你，登录成功',
			data: 'Bearer ' + token // Bearer作为字符串附加到token前面，表示的是一种身份验证类型，一种规范的表达方式，即：Bearer Token
		})

	} else {
		res.send({
			code: 500,
			message: '账号或密码错误，登录失败'
		})
	}
}
/**
 * 2.分类列表的获取
 * http://localhost:8081/manage_cat
 *
 * */
exports.getCat = async (req, res) => {
	// 分类列表查询
	const sql = "select * from `category`";
	const rows = await Query(sql, []);
	console.log("test", rows);
	if (rows.length > 0) {
		// 查询成功
		res.send({
			code: 200,
			message: '查询数据成功',
			data: rows
		})
	} else {
		res.send({
			code: 50,
			message: '查询失败'
		});

	}
}
/**
 * 3.分类列表记录的删除
 *
 * */
exports.deleteCatById = async (req, res) => {
	const {id} = req.params;
	console.log(id);
	const sql = "delete from `category` where `id`=?";
	const rows = await Query(sql, [id]);
	console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '删除成功'
		})
	} else {
		res.send({
			code: 500,
			message: '删除失败'
		})
	}

}

/**
 * 4.分类列表的修改
 * 分类列表的数据回显，在前端直接处理；只需处理修改后的提交
 * 访问：http://localhost:8081/manage_cat/:id
 * 动态参数id
 * 提交的body参数：name；提交的data
 * req.params获取
 *
 * */


exports.putCatById = async (req, res) => {
	const {id} = req.params;
	const {name} = req.body;
	console.log(id);
	console.log(name);
	const sql = "update `category` set `name`=? where `id`=?";
	const rows = await Query(sql, [name, id]);
	console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '修改分类成功'
		});
	} else {
		res.send({
			code: 500,
			message: '修改分类失败'
		});
	}
}
/**
 * 5.分类列表的添加
 * method：post
 * 请求地址：http://localhost:8081/manage_cat
 * 参数：body参数name
 *
 * */
exports.addCat = async (req, res) => {
	const {name} = req.body;
	// 使用雪花切片算法，产生id
	const sql = "insert into `category`(`id`,`name`) values(?,?)";
	// 根据雪花切片算法，产生随即id
	const id = genid.NextId();
	const rows = await Query(sql, [id, name]);
	console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '添加分类成功'
		});
	} else {
		res.send({
			code: 500,
			message: '添加分类失败'
		})
	}

}












































































































































































































































































































