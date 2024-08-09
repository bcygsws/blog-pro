const mysql = require("mysql");
// 1.创建数据库连接池
let db;

// 2.定义函数生成数据库连接池db,每次查询时，生成新的db
function handleConnect() {
	const myDB = mysql.createConnection({

		host: "localhost",
		port: "3306",
		user: "root",
		password: "123456",// 注：密码写成number数字123456报错
		database: "blog"
	});
	myDB.on("error", (err) => {
		// 如果只是协议连接丢失，还能挽救，尝试重新连接
		if (err.code === "PROTOCOL_CONNECTION_LOST") {
			handleConnect();
		} else {// 抛出错误
			throw new Error(`${err}`);
		}

	});
	// 3.获取创建的连接池对象db
	db = myDB;
}

/**
 * @数据库操作函数的封装：
 * 1.在封装的查询函数中，每次生成新的db对象，并且实施db的连接db.connect(),待其中的query方法执行完毕后(db.query() )，关闭数据库连接db.end()
 * 2.这样做，有效屏蔽数据库关闭时的各种错误
 *
 * */
function Query(sql, data) {
	// 4.每次异步查询操作时，生成新的db
	handleConnect();
	// 5.连接数据库
	// db.connect();

	// connect(cb)，回调cb可以不写，这里写成，是可以有效排查数据库连接过程中，在哪个阶段出错了
	db.connect((err) => {
		if (err) {
			console.log(`数据库连接错误：${err}`)
		} else {
			console.log("MySQL数据库连接成功!");
		}
	});

	return new Promise((resolve, reject) => {
		// 在数据库查询，为异步操作，使用promise处理
		db.query(sql, data, (err, rows, fields) => {
			if (err) {
				reject(err);
			} else {
				console.log(rows[0]);
				// 将rows对象,使用resolve()返回
				resolve(rows);

			}

		});
		// 6.执行完查询操作，关闭数据库连接
		db.end();
	})

}

module.exports = {
	Query

}