import cartModel from "../models/cartsch.js";

const addcart = async (req,res)=>{
    console.log(req.session.user);
    
    const Cartarr = []
    const{id} = req.session.user
    const {ProductId,Quantity} = req.body
    const UserId = id
    


const dataToSet = {
    UserId,
    ProductId,
    Quantity
}

Cartarr.push(dataToSet)
await cartModel.create(Cartarr)
res.json('Added to cart')

}


export {addcart}