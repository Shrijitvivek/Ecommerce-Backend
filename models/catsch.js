import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})

const categoryModel = mongoose.model("Category",categorySchema,"category")
export default categoryModel;