/**
 *
 * @name:
 * @description:
 *
 *
 * */
const {Query} = require("../mysql/mysql");
const doLogin = (data) => {
	const sql = "select * from `admin` where `account`=? and `password`=? ";
	return Query(sql, data);
}
module.exports = {doLogin};