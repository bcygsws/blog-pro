/**
 * @name:app.js
 * @description:入口文件
 *
 * */
const express = require('express');
const app = express();
const path = require('path');
// multer中间件，用于处理上传的图片
const multer = require('multer');
const {SECRET_KEY} = require('./src/config/config');
// 用于解析请求体
const bodyParser = require('body-parser');
const router = require('./src/router/router');
// token验证
// 2.用于自动验证jwt,并将解析后的token信息附着在请求对象上
const {expressjwt: expJWT} = require('express-jwt');


// 请求体解析器bodyParse处理不同格式的数据
// 处理application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: true
}));
// 处理application/json格式数据
app.use(bodyParser.json());
// 服务端访问静态资源(访问上传的图片，需要设置静态资源托管路径)
// 修改文章列表 记录时，图片在富文本编辑器中回显，必须设置图片托管在public以下的文件夹中
// 例如：http://localhost:8081/upload/570090275553349.jpg
app.use(express.static(path.join(__dirname, 'public')));
// 上传的模块引入
const upload = multer({// options配置项，最基本的属性就是dest,用于设定上传图片的临时路径
	dest: './public/upload/temp'
});
app.use(upload.any());
// 3.使用express-jwt中间件进行登录验证

// 跨域配置
app.all("*", (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	// 任意变量都可以作为 请求头 字段
	// res.header('Access-Control-Allow-Headers', '*');
	// 增加了token和tokenText字段
	res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,X-Requested-With,token,tokenText');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
	console.log(req);
	if (req.method.toLowerCase() === 'options') {
		res.sendStatus(200);
	} else {// 不是OPTIONS则放行
		next();
	}
});
// expJWT(密钥对象，加密算法对象).unless({path:[排除路由项]})
app.use(
	expJWT({secret: SECRET_KEY, algorithms: ['HS256']}).unless({path: ['/login']})
);
// 4.错误处理中间件
app.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send({code: 0, msg: err.message});
	}
	res.send({code: 500, message: '未知的错误'});
});


// 路由处理
app.use(router);
const PORT = 8081;
app.listen(`${PORT}`, () => {
	console.log(`server is running at ${PORT}`);
});