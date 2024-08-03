/**
 * @name:adminRouter
 * @description:用户路由请求处理
 *
 * */
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const {loginService, getCat, deleteCatById, putCatById, addCat, getBlog, deleteArtById, addArt, uploadImage} = require("../service");
const {Query} = require('../mysql/mysql');
// 获取expJWT方法
const {expressjwt: expJWT} = require('express-jwt');
const {SECRET_KEY} = require("../config/config");
// 使用expressJWT中间件进行登录验证
const authenticateJwt = expJWT({secret: SECRET_KEY, algorithms: ['HS256']});

// 1.登录路由
router.post('/login', loginService);
// 2.分类列表的获取
router.get('/manage_cat', authenticateJwt, getCat);
// 3.根据id,删除分类列表的一条记录
router.delete('/manage_cat/:id', authenticateJwt, deleteCatById);
// 4.根据id,修改分类列表
// 修改前数据的回显，在前端处理，只需做提交的接口
router.put("/manage_cat/:id", authenticateJwt, putCatById);
// 5.分类列表的添加
router.post('/manage_cat', authenticateJwt, addCat);
// 6.博客文章列表获取路由
router.get('/manage_art', authenticateJwt, getBlog)
// 7.博客文章列表删除
router.delete('/manage_art/:id', authenticateJwt, deleteArtById);
// 8.博客文章列表的添加
router.post('/manage_art', authenticateJwt, addArt);
// 9.本地图片上传接口
router.post('/upload/rich_editor_upload', authenticateJwt, uploadImage)


module.exports = router;


