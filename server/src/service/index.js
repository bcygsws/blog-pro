/**
 *
 * @name:
 * @description:
 *
 *
 * */
const fs = require('fs');
const path = require('path');
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
const {SECRET_KEY, EXPIRES_IN} = require("../config/config");
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
	const {rows} = await Query(sql, [account, password]);
	//console.log("testing", rows);// 查询的结果
	console.log("testing", rows[0]);// 查询的结果
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
		const token = jwt.sign(rules, SECRET_KEY, {expiresIn: EXPIRES_IN});
		// 将token值更新到数据库中
		const sql = "update `admin` set `token`=? where `id`=?";
		await Query(sql, [token, admin_id]);
		res.send({
			code: 200,
			message: '恭喜你，登录成功',
			data: 'bearer ' + token // Bearer作为字符串附加到token前面，表示的是一种身份验证类型，一种规范的表达方式，即：Bearer Token
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
	const {rows} = await Query(sql, []);
	//console.log("test", rows);
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
	const {rows} = await Query(sql, [id]);
	//console.log(rows);
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
	const {rows} = await Query(sql, [name, id]);
	//console.log(rows);
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
	const {rows} = await Query(sql, [id, name]);
	//console.log(rows);
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
/**
 * @文章列表的获取
 * 访问地址：http://localhost:8081/manage_art?categoryId=''&page=1&pageSize=5&search=''
 * 查询参数：categoryId page pageSize search
 *
 * */
exports.getBlog = async (req, res) => {
	// page：当前所在页，pageSize:每页容量，categoryId:文章分类id;keywords:检索关键字
	let {page, pageSize, categoryId, keywords} = req.query;
	page = page ? parseInt(page) : 1;
	pageSize = pageSize ? parseInt(pageSize) : 5;
	categoryId = categoryId ? parseInt(categoryId) : 0;
	keywords = keywords ? keywords : "";
	// 不传分类id时，categoryId已经置为0；那么，categoryId只有0，和其他大于0的情况
	let whereSQL = [];
	let data = [];
	if (categoryId) {
		whereSQL.push('`category_id`=?');
		data.push(categoryId);
	}
	if (keywords) {
		whereSQL.push("(`title` like? or `content` like?)");
		data.push("%" + keywords + "%");
		data.push("%" + keywords + "%");
	}
	let join_sql = '';
	if (whereSQL.length > 0) {// 表示按照分类id查询或者关键字模糊查询，至少有一个存在
		// whereSQL中有一个元素时，join方法处理后，返回元素本身
		join_sql = 'where ' + whereSQL.join(' and ');
	}
	// let sql = 'select *from `blog` ' + join_sql + ' order by `create_time` desc limit ?,?';
	// 限制，content字段长度不超过50个字符
	//let sql = "select `id`,`category_id`,`title`,SUBSTR(`content`, 1, 80) as content,`create_time` from `blog` " + join_sql + " order by `create_time` desc limit ?,?";
	let sql = "select `id`,`category_id`,`title`,SUBSTR(`content`, 1, 80) as content,`create_time` from `blog` " + join_sql + " order by `create_time` desc limit ? offset ?";
	// blog列表的数据总数量，也需要返回前端
	let countSQL = 'select count(*) as count from `blog`' + join_sql;
	const p1 = Query(countSQL, data);// 只是获取满足条件的数据总数，与分页的两个参数无关，不需要concat
	// array.concat()方法返回一个新数组，但不会更改原数组
	//const p2 = Query(sql, data.concat([(page - 1) * pageSize, pageSize]));// 需要concat分页的两个参数?,? 第一个参数：当前数据的编号数（第一条数据，编号是0）；第二个参数：每页的容量
	const p2 = Query(sql, data.concat([pageSize, (page - 1) * pageSize]));// 需要concat分页的两个参数?,? 第一个参数：当前数据的编号数（第一条数据，编号是0）；第二个参数：每页的容量
	//
	let result;
	result = await Promise.all([p1, p2]);
	//console.log(result);
	//console.log("test-rows",result);// [{rows:[总数]},{rows:[list列表]}]
	const {rows: total} = result[0]
	const {rows: list} = result[1];
	//console.log("test", rows[0]);
	if (result[1].rows.length > 0) {
		res.send({
			code: 200,
			message: '文章列表请求成功',
			data: {
				count: total[0]?.count,
				list: list
			}
		})
	} else {
		res.send({
			code: 500,
			message: '文章列表请求失败'
		})
	}

}
/**
 * @文章列表的删除
 * 访问地址：http://localhost:8081/manage_art/:id
 *
 * */
exports.deleteArtById = async (req, res) => {
	const {id} = req.params;
	// 根据id,删除当前记录
	const sql = 'delete from `blog` where `id`=?';
	const {rows} = await Query(sql, [id]);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '删除一条记录成功'
		})
	} else {
		res.send({
			code: 500,
			message: '删除失败'
		})
	}
}
/**
 * @文章列表的添加
 * 访问地址：http://localhost:8081/manage_art
 * 请求方式：post
 * body参数
 * 时间戳5种方式：(new Date()).getTime()  (new Date()).valueOf() Date.now() Number(new Date())  Date.parse(new Date())
 *
 * */
exports.addArt = async (req, res) => {
	const {categoryId, title, content} = req.body;
	const sql = "insert into `blog`(`id`,`category_id`,`title`,`content`,`create_time`) values(?,?,?,?,?)";
	const info = {
		id: genid.NextId(),
		category_id: parseInt(categoryId),
		title: title,
		content: content,
		create_time: (new Date()).getTime()
	}
	const {rows} = await Query(sql, [info.id, info.category_id, info.title, info.content, info.create_time]);
	// console.log("mytest", rows);
	// console.log("mytest", rows.affectedRows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '添加成功'
		})
	} else {
		res.send({
			code: 500,
			message: '添加失败'
		})
	}

}
/**
 * @本地图片上传接口
 * 请求地址：http://localhost:8081/manage_art//upload/rich_editor_upload
 * 请求方式：post
 *
 *
 * */
exports.uploadImage = async (req, res) => {
	if (!req.files) {// 如果上传文件不存在
		res.send({
			errno: 1, // 只要不等于 0 就行
			message: "失败信息"
		})
	} else {
		console.log(req.files);
		/*
		打印结果：
		[{
           fieldname: 'files',
           originalname: '特温特.jpg',
           encoding: '7bit',
           mimetype: 'image/jpeg',
           destination: './public/upload/temp',
           filename: '075fc5fc5eb1f8c2606efc7a79471265',
           path: 'public\\upload\\temp\\075fc5fc5eb1f8c2606efc7a79471265',
           size: 273591
         }]
		 */
		//定义数组，存储拼接好的图片的url地址
		let uploadFiles = [];
		for (let file of req.files) {
			// 1.获取文件名后缀，例如：jpg，从字符j开始截取到最后面，可以获得后缀名称
			const ext_name = file.originalname.substring(file.originalname.indexOf(".") + 1)
			// 2.定义文件名称
			let full_name = genid.NextId() + "." + ext_name;
			// 3.使用文件系统重命名方法renameSync，完成上传图片文件的重命名更改文件存储路径
			// process.cwd()方法：表示获取当前项目的工作路径，拼接后，是临时文件的绝对路径
			fs.renameSync(path.join(process.cwd(), "./public/upload/temp", file.filename), path.join(process.cwd(), "./public/upload", full_name));
			// 4.将移动路径+重命名的文件，存入数组uploadFiles
			uploadFiles.push("/upload/" + full_name);
			// 5.返回信息，给前端
			res.send({
				"errno": 0, // 注意：值是数字，不能是字符串
				"data": {
					"url": uploadFiles[0], // 图片 src,必须
					"alt": "本地上传图片",// 图片的描述文字，非必须
					"href": ""// 图片的链接，非必须
				}
			});

		}

	}
}
/**
 * @根据id,请求数据
 * 请求地址：http://localhost:8081/manage_art/:id
 *
 *
 * */
exports.getArtById = async (req, res) => {
	const {id} = req.params;
	//const sql = "select blog.*,category.name from `blog` join `category` on blog.category_id=category.id where blog.id=?";
	//const sql = "select JSON_OBJECT('id',blog.id,'title',blog.title,'content',blog.content,'create_time',blog.create_time,'name',category.name,'comment_list',JSON_ARRAYAGG(JSON_OBJECT('art_id',my_list.art_id,'img',my_list.img,'content',my_list.content,'com_time',my_list.com_time,'username',my_list.username,'fav',my_list.fav))) as article FROM blog join category on category.id=blog.category_id  join my_list on blog.id=my_list.art_id where blog.id=? GROUP BY my_list.art_id ASC";
	//const sql = "select JSON_OBJECT('id',blog.id,'title',blog.title,'content',blog.content,'create_time',blog.create_time,'name',category.name,IFNULL('comment_list','[]'),(select JSON_ARRAYAGG(JSON_OBJECT('art_id',art_id,'img',img,'content',content,'com_time',com_time,'username',username,'fav',fav)) from my_list where art_id=? )) as article FROM blog join category on category.id=blog.category_id where blog.id=?";
	//const sql = "select JSON_OBJECT('id',blog.id,'category_id',blog.category_id,'title',blog.title,'content',blog.content,'create_time',blog.create_time,'name',category.name,'comment_list',coalesce((select JSON_ARRAYAGG(JSON_OBJECT('id',id,'art_id',art_id,'img',img,'content',content,'com_time',com_time,'username',username,'fav',fav))  from my_list where art_id=?),'[]')) AS article FROM blog join category on category.id=blog.category_id where blog.id=?";
	const sql = "select JSON_OBJECT('id',blog.id,'category_id',blog.category_id,'title',blog.title,'content',blog.content,'create_time',blog.create_time,'name',category.name) AS article FROM blog join category on category.id=blog.category_id where blog.id=?";
	const {rows} = await Query(sql, [id]);
	//console.log(rows);
	console.log(rows[0]);
	//console.log("test", JSON.parse(rows[0]['article']));
	const art_data = JSON.parse(rows[0]['article']);
	// JSON.parse()方法没有将嵌套的属性，comment_list上的json字符串对象化，单独处理
	//art_data['comment_list'] = JSON.parse(art_data['comment_list']);
	console.log(art_data);
	if (rows.length > 0) {
		res.send({
			code: 200,
			message: '当前记录回显成功',
			data: art_data
		});
	} else {
		res.send({
			code: 500,
			message: '当前记录请求失败'
		});
	}
}
/**
 * @修改数据
 * 请求地址：http://localhost:8081/manage_art
 * body参数：
 * id: number
 * categoryId: string
 * title: string
 * content: string
 *
 *
 * */
exports.submitArt = async (req, res) => {
	const {id, categoryId, title, content} = req.body;
	const sql = "update `blog` set `category_id`=?,`title`=?,`content`=?,`create_time`=? where `id`=?";
	const {rows} = await Query(sql, [categoryId, title, content, Date.now(), id]);
	//console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: '文章记录修改成功'
		});
	} else {
		res.send({
			code: 500,
			message: '文章记录修改失败'
		});
	}
}
/**
 * @name:getComById
 * @description:根据id请求评论列表
 *
 * */
//exports.getComById = async (req, res) => {
//	const artId = req.params.id;
//	const {page, pageSize} = req.query;
//	console.log(page, pageSize);
//	const sql = "select * from `my_list` where `art_id`=? order by `com_time` desc limit ? offset ?";
//	const rows = await Query(sql, [artId, parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)]);
//	//console.log(rows);
//	if (rows.length > 0) {
//		res.send({
//			code: 200,
//			message: '评论列表请求成功',
//			data: rows
//		});
//	} else {
//		res.send({
//			code: 500,
//			message: '评论列表请求失败'
//		});
//	}
//
//}

/**
 * 参数：
 * 路径参数：artId,必须
 * 查询参数：timestamp,pageSize
 * timestamp，可选；不传值使用当前表中按时间排序，最大时间戳值
 *
 *
 *
 * */
exports.getComByTimestamp = async (req, res) => {
	// 1.获取节点时间戳数组
	// id为路径参数，必传值
	const artId = req.params.id;
	let {timestamp, pageSize} = req.query;
	//console.log("test1", timestamp);
	// 处理前端忘记为两个查询参数传值的情况
	timestamp = timestamp ? parseInt(timestamp) : 0;
	pageSize = pageSize ? pageSize : 5;
	//console.log("test2", timestamp);
	const data = {
		artId: parseInt(artId),
		size: parseInt(pageSize)
	}
	const sql = "select com_time,rn from (select com_time, ROW_NUMBER() over (PARTITION BY art_id ORDER BY com_time DESC) as rn from my_list WHERE art_id=? ) emp  WHERE rn % ? =1";
	let {rows: row1} = await Query(sql, [data.artId, data.size]);
	console.log("test", row1);

	// 2.根据节点时间戳返回分页数据
	const SQL = "SELECT * FROM my_list WHERE art_id=? and com_time <=? ORDER BY com_time desc limit ?";
	//根据传入的时间戳值，设置参数SQL_DATA
	let SQL_DATA = [];
	// 并将下次请求节点时间戳值返回前端
	let pre_timestamp;
	// 存储分页节点的时间戳值，pageArray值已经按照降序排列好了
	let timeArray = row1.map(item => (item.com_time));
	console.log(timeArray);
	if (row1.length === 1) {
		SQL_DATA = [data.artId, timeArray[0], data.size];
		pre_timestamp = 0;
		const {rows} = await Query(SQL, SQL_DATA);
		res.send({
			code: 200,
			message: "请求评论列表成功",
			data: {
				list: rows,
				pre_timestamp: pre_timestamp
			}
		})
	} else if (row1.length > 1) {
		if (!timeArray.includes(timestamp)) {// 表示最开始取分页数据的情况
			//console.log(timeArray.includes(timestamp));
			SQL_DATA = [data.artId, timeArray[0], data.size];
			pre_timestamp = timeArray[1];
			const {rows} = await Query(SQL, SQL_DATA);
			res.send({
				code: 200,
				message: "请求评论列表成功",
				data: {
					pre_timestamp: pre_timestamp,
					list: rows
				}
			});

		} else {// 请求参数时间戳在数组中
			//console.log(timeArray.includes(timestamp));
			let index = timeArray.indexOf(timestamp);
			SQL_DATA = [data.artId, timeArray[index], data.size];
			if (timeArray.length > index + 1) {
				pre_timestamp = timeArray[index + 1];
			} else {
				pre_timestamp = 0;// 表示这已经是最后一页数据了
			}
			console.log("my_test", pre_timestamp);
			const {rows} = await Query(SQL, SQL_DATA);
			res.send({
				code: 200,
				message: "请求评论列表成功",
				data: {
					pre_timestamp: pre_timestamp,
					list: rows
				}
			})

		}


	} else {
		res.send({
			code: 500,
			message: "评论列表没有记录"
		});
	}

}
/**
 * @向详情页中，添加一条评论
 * 请求地址：http://localhost:8081/comment
 *
 * */
exports.submitComment = async (req, res) => {
	const {artId, content} = req.body;
	// 产生一个随机图像
	const avatars = [
		"https://s1.imagehub.cc/images/2023/07/13/img27.th.jpeg",
		"https://s1.imagehub.cc/images/2023/06/28/img4.th.jpeg",
		"https://s1.imagehub.cc/images/2023/07/13/img20.th.jpeg",
		"https://s1.imagehub.cc/images/2023/07/13/img21.th.jpeg",
		"https://s1.imagehub.cc/images/2023/07/13/img30.th.jpeg"
	];
	const img_url = avatars[Math.floor(Math.random() * 5)];
	const sql = "insert into `my_list`(`id`,`art_id`,`img`,`content`,`com_time`,`username`,`fav`) values(?,?,?,?,?,?,?)";
	const data = {
		id: genid.NextId(),
		art_id: artId,
		img: img_url,
		content: content,
		com_time: Date.now(),
		username: genid.NextId().toString(),
		fav: 0

	}
	// 给content起个别名，以避免和req.body中content解构重名
	const {id, art_id, img, content: _content, com_time, username, fav} = data;
	const {rows} = await Query(sql, [id, art_id, img, _content, com_time, username, fav]);
	//console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: "你成功添加了一条评论！"
		});
	} else {
		res.send({
			code: 500,
			message: "添加评论失败了"
		});
	}
}
/**
 * @name:
 * @description:根据列表id,修改点赞数
 * 访问地址：http://localhost:8081/comment/1
 *
 * */
exports.changeComment = async (req, res) => {
	const {id, fav} = req.body;
	const sql = "update `my_list` set `fav`=? where `id`=?";
	const {rows} = await Query(sql, [fav, id]);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: "点赞数量修改成功"
		});
	} else {
		res.send({
			code: 500,
			message: "点赞数修改失败"
		})
	}
}
/**
 *
 *
 * */
exports.delComment = async (req, res) => {
	const {id} = req.params;
	const sql = "delete from `my_list` where `id`=?";
	const {rows} = await Query(sql, [id]);
	console.log(rows);
	if (rows.affectedRows) {
		res.send({
			code: 200,
			message: "成功删除了一条记录"
		});
	} else {
		res.send({
			code: 500,
			message: "删除一条记录失败"
		});
	}
}





































































































































































































































































































