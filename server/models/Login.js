const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const shechma = mongoose.Schema({
    username: { type: String },

    email:{type:String},

    telephone:{type:Number},

    delivery:{
        type:Boolean,
        // 默认值为false
        default:false,
    },

    password: {
        type: String,

        // 禁止查看管理员密码
        select: false,
        // 给密码加密
        set(val) {
            return bcryptjs.hashSync(val, 10);
        }

    },

    date: {
        type: String,

        default: new Date().toLocaleDateString()
    }
})

module.exports = mongoose.model('Login', shechma);