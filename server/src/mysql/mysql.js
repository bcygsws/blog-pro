const mysql = require("mysql");
// 1.创建数据库连接池

const db = mysql.createConnection({

	host: "localhost",
	user: "root",
	password: "123456",// 注：密码写成number数字123456报错
	database: "blog"
});
// 2.开始连接数据库
db.connect(err => {
	if (err) {
		console.log(`mysql数据库连接失败:${err}`)
	}
	console.log("mysql连接成功");
});

function mysqlConn(sql, data) {

	return new Promise((resolve, reject) => {
		// 在数据库查询，为异步操作，使用promise处理
		db.query(sql, data, (err, rows, fields) => {
			if (err) {
				reject(err);
			} else {
				console.log(rows[0]);
				// 将err和rows组织成一个对象{err,rows},使用resolve()返回
				resolve(rows);

			}

		});
	})

}

// 关闭数据库函数closeMysql
// function closeMysql(conn) {
// 	conn.end((err) => {
// 		if (err) {
// 			console.log(`数据库关闭失败${err}`)
// 		}
// 		console.log("数据库关闭成功！");
// 	})
// }


module.exports = {
	mysqlConn

}