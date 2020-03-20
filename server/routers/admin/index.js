module.exports = app => {
    const express = require('express');
    //  引入用户模块
    const AdminUser = require('../../models/Login');
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');

    // 登录限制
    const authMiddleware = require('../../middleware/auth');
    const resourceMiddleware = require('../../middleware/resource')
    const router = express.Router({
        mergeParams: true
    });

    // 插入数据
    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body);
        res.send(model);
    })

    // 分类列表
    router.get('/',authMiddleware(),async (req, res) => {
        const queryOptions = {};
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const items = await req.Model.find().setOptions(queryOptions);
        res.send(items);
    })

    // 分类删除
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body);
        res.send({
            success: true
        });
    });

    // 编辑数据
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    })


    // 更新数据
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        res.send(model);
    })

    // api通用接口
    app.use('/admin/api/rest/:resource', authMiddleware(),resourceMiddleware(), router);


    //文件上传
    const multer = require('multer');
    const upload = multer({ dest: __dirname + '/../../uploads' });
    app.post('/admin/api/upload',authMiddleware(), upload.single('file'), async (req, res) => {
        const file = req.file;
        /* 给file加上ulr */
        file.url = `http://localhost:8181/uploads/${file.filename}`;
        res.send(file);
    })

    app.use('/admin/api/login', async (req, res) => {
        const { username, password} = req.body;
        // 1.通过用户名查找对应用户
        const adminName = await AdminUser.findOne({ username }).select('+password')
        assert(adminName,422,'用户不存在')
        // 2.校验密码
        const isValue = require('bcryptjs').compareSync(password, adminName.password);
        assert(isValue,422,'密码错误')
        // 3.查看账户状态
        const isStatus = await AdminUser.findOne({username},function(err,data){
            return data.delivery;
        });
        assert(isStatus.delivery == true,422,'该账号无法登录')
        // 4.返回token
        const token = jwt.sign({
            // 加密用户的id 并返回
            id: adminName._id
        }, app.get('secret'));
        res.send({ token });
    })


    // 错误处理函数
    app.use(async (err,req,res,next)=>{
        return res.status(err.status || 500).send({
            message:err.message
        })
    })
}

