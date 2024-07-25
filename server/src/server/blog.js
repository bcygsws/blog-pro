/**
 *
 * @name:
 * @description:
 *
 *
 * */
const {mysqlConn} = require("../mysql/mysql");
const doLogin = (data) => {
	const sql = "select * from `admin` where `account`=? and `password`=? ";
	return mysqlConn(sql, data);
}
module.exports = {doLogin};