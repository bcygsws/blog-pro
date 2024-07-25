/**
 * @name:app.js
 * @description:入口文件
 *
 * */
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// 请求体解析器bodyParse处理不同格式的数据
// 处理application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));
// 处理application/json格式数据
app.use(bodyParser.json());
// 服务端访问静态资源(访问上传的图片，需要设置静态资源托管路径)
app.use(express.static(path.join(__dirname, 'public')));
// 跨域配置
app.all("*", (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
	if (req.method.toLowerCase() === 'options') {
		res.sendStatus(200);
	} else {// 不是OPTIONS则放行
		next();
	}
});
// 路由处理
app.use(require("./src/router/adminRouter"));
const PORT = 8081;
app.listen(`${PORT}`, () => {
	console.log(`server is running at ${PORT}`);
});