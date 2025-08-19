import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    UserId :{
        type:mongoose.Types.ObjectId
    },

    Items:[
        {
          ProductName:{
        type:String,
        
    },

    Price:{
        type:Number,
        
    },
    
    Quantity:{
        type:Number
    },

    SubTotal:{
        type:Number
    }
        }
    ],
    Total:{
        type:Number
    },

    DeliveryStatus :{
      type:String,
      default:"pending"
    },
   
},
{timestamps : true})

const OrderModel = mongoose.model("od",orderSchema,"Orders")
export default OrderModel