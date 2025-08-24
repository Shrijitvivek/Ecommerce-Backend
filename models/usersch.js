import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },

    status:{
        type : Boolean,
        default : true
    }
})

const userModel = mongoose.model('user',userSchema,'customers')
export default userModel