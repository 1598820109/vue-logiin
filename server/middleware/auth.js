module.exports = options =>{
        const AdminUser = require('../models/Login');
        const jwt = require('jsonwebtoken');
        const assert = require('http-assert');

        return async (req,res,next) =>{
            // const token = String(req.headers.authorization || '').split(' ').pop();
            // assert(token,401,'请先登录')
            // 解析token 获取用户账号
            // const { id } =  jwt.verify(token,req.app.get('secret'));
            // assert(id,401,'请先登录')
            // 查找用户账号
            // req.user = await AdminUser.findById(id);
            // assert(req.user,401,'请先登录')
            await next();

        } 
} 