const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shechma = mongoose.Schema({

    user:{type:String},


    pass:{
        type:String,

        select:false,
        // set方法
        set(val){
            return bcrypt.hashSync(val, 10);
        }
    },

    date:{
        type:String,

        default:new Date().toLocaleDateString()
    }

})

module.exports = mongoose.model('Registered',shechma);