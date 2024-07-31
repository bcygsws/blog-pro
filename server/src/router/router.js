/**
 * @name:adminRouter
 * @description:用户路由请求处理
 *
 * */
const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const {loginService, getCat, deleteCatById, putCatById, addCat} = require("../service");
const {Query} = require('../mysql/mysql');
// 1.登录路由
router.post('/login', loginService);
// 2.分类列表的获取
router.get('/manage_cat', getCat);
// 3.根据id,删除分类列表的一条记录
router.delete('/manage_cat/:id', deleteCatById);
// 4.根据id,修改分类列表
// 修改前数据的回显，在前端处理，只需做提交的接口
router.put("/manage_cat/:id", putCatById);
// 5.分类列表的添加
router.post('/manage_cat', addCat);


module.exports = router;
