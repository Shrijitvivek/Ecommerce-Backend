import mongoose from "mongoose"

const prodSchema = new mongoose.Schema({

    ProductName:{
        type:String,
        required:true
    },

    Price:{
        type:String,
        required:true
    },

    Category:{
         type:String,
        required:true
    },

    ProductImage:{
         type:String,
        required:true
    }
})

const prodModel = mongoose.model('prod',prodSchema,'products')
export default prodModel