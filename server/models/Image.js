const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    
        imageUrl:{type:String},
        
        date:{
            type:String,

            default: new Date().toDateString(),
        }

})


module.exports = mongoose.model('Image',schema);