import mongoose, { Types } from "mongoose";
import cartModel from "../models/cartsch.js";

const addcart = async (req, res) => {
    const userId = req.session.user.id;
    const { ProductId, Quantity } = req.body;

    let cart = await cartModel.findOne({ userId });

    if (!cart) {

        cart = await cartModel.create({
            UserId: userId,
            Items: [{ ProductId, Quantity }]
        });
    } else {

        const item = cart.Items.find(i => i.ProductId.toString() === ProductId);
        if (item) {
            item.Quantity = item.Quantity + Quantity;
        } else {
            cart.Items.push({ ProductId, Quantity });
        }
        await cart.save();
    }

    res.json("Product added to cart");
}

const editcart = async (req, res) => {
    try {
        const UserId = req.session.user.id;
        const ProductId = req.params.id
        const {  Quantity } = req.body;

        const cart = await cartModel.findOne({ UserId });

        if (!cart) {
            return res.status(404).json('Cart not found');
        }

        const item = cart.Items.find(i => i.ProductId.toString() === ProductId);

        if (!item) {
            return res.status(404).json('Item not found in cart');
        }

        item.Quantity = Quantity;
        await cart.save();

        return res.status(200).json('Item quantity updated');
    } catch (error) {
        console.error(error);
        return res.status(500).json('Something wrong');
    }
};

const delcart = async (req, res) => {
    try {
        const UserId = req.session.user.id;
        const ProductId = req.params.id; 

        const cart = await cartModel.findOne({ UserId });

        if (!cart) {
            return res.status(404).json("Cart not found");
        }

       
        const originalLength = cart.Items.length;
        cart.Items = cart.Items.filter(i => i.ProductId.toString() !== ProductId);

        if (cart.Items.length === originalLength) {
            return res.status(404).json("Item not found in cart");
        }

        await cart.save();

        res.status(200).json("Item removed from cart");
    } catch (error) {
        console.error(error);
        res.status(500).json("Something went wrong");
    }
};


const Total = async (req, res) => {
    const { id } = req.session.user
    const UserId = new mongoose.Types.ObjectId(id)

    const UserCart = await cartModel.aggregate([
        {
            $facet: {
                CartDetails: [
                    {
                        $match: {
                            UserId
                        }
                    },
                    { $unwind: "$Items" },
                    {
                        $lookup: {
                            from: "products",
                            localField: "Items.ProductId",
                            foreignField: "_id",
                            as: "Proddet"
                        }
                    },
                    { $unwind: "$Proddet" },

                    {
                        $addFields: {
                            SubTotal: { $multiply: ["$Proddet.Price", "$Items.Quantity"] }
                        }
                    }

                ],
                Total: [
                    {
                        $match: {
                            UserId
                        }
                    },
                    { $unwind: "$Items" },
                    {
                        $lookup: {
                            from: "products",
                            localField: "Items.ProductId",
                            foreignField: "_id",
                            as: "Proddet"
                        }
                    },
                    { $unwind: "$Proddet" },

                    {
                        $addFields: {
                            SubTotal: { $multiply: ["$Proddet.Price", "$Items.Quantity"] }
                        }
                    },
                    {
                        $group: {
                            _id: "",
                            Total: { $sum: "$SubTotal" }
                        }
                    }
                ]
            }
        }

    ])

    res.json({ UserCart })
}
export { addcart, Total, editcart , delcart};
