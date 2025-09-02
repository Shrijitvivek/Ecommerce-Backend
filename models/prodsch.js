import mongoose from "mongoose"


const prodSchema = new mongoose.Schema({

    ProductName:{
        type:String,
        
    },

    Price:{
        type:Number,
        
    },

    Category:{
        type:mongoose.Types.ObjectId,
        ref:'Category'
       
    },

    ProductImage:{
         type:String,
       
    },

    Stock:
    {
        type:Number,
       
    },

    Description:{
        type:String,
       
    }
})

const prodModel = mongoose.model('prod',prodSchema,'products')
export default prodModel