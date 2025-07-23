import mongoose from "mongoose";
const category = {
    name:"Phones and Laptops",
    description:"Smart devices Info"
}

const database = 'mongodb://127.0.0.1:27017/BackendEcommerce'
let data = await mongoose.connect(database)
const db = data.connection.db

async function addCat(){
    try{
 db.collection('category').insertOne(category)
    }
    catch(error){
        console.log(error);
        
    }
   
}
addCat()