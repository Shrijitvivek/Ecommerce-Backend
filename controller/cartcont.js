import mongoose from "mongoose";
import cartModel from "../models/cartsch.js";

const addcart = async (req, res) => { // add to cart
    try {
        const userId = req.session.user.id;
        const { ProductId, Quantity } = req.body;

        const objectProductId = new mongoose.Types.ObjectId(ProductId);
        let cart = await cartModel.findOne({ UserId: userId });

        if (!cart) {
            cart = await cartModel.create({
                UserId: userId,
                Items: [{ ProductId: objectProductId, Quantity }]
            });
        } else {
            const item = cart.Items.find(i => i.ProductId.equals(objectProductId));
            if (item) {
                item.Quantity += Quantity;
            } else {
                cart.Items.push({ ProductId: objectProductId, Quantity });
            }
            await cart.save();
        }

        res.json("Product added to cart");
    } catch (error) {
        console.error(error);
        res.status(500).json("Error adding product to cart");
    }
};

const editcart = async (req, res) => { // update cart
    try {
        const UserId = req.session.user.id;
        const ProductId = req.params.id;
        const { Quantity } = req.body;

        const objectProductId = new mongoose.Types.ObjectId(ProductId);
        const cart = await cartModel.findOne({ UserId });

        if (!cart) {
            return res.status(404).json('Cart not found');
        }

        const item = cart.Items.find(i => i.ProductId.equals(objectProductId));
        if (!item) {
            return res.status(404).json('Item not found in cart');
        }

        item.Quantity = Quantity;
        await cart.save();

        res.status(200).json('Item quantity updated');
    } catch (error) {
        console.error(error);
        res.status(500).json('Something went wrong');
    }
};

const delcart = async (req, res) => {
    try {
        const UserId = req.session.user.id;
        const ProductId = req.params.id;
        const objectProductId = new mongoose.Types.ObjectId(ProductId);

        const cart = await cartModel.findOne({ UserId });

        if (!cart) {
            return res.status(404).json("Cart not found");
        }

        const originalLength = cart.Items.length;
        cart.Items = cart.Items.filter(i => !i.ProductId.equals(objectProductId));

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
    try {
        const { id } = req.session.user;
        const UserId = new mongoose.Types.ObjectId(id);

        const UserCart = await cartModel.aggregate([
            {
                $facet: {
                    CartDetails: [
                        { $match: { UserId } },
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
                        { $match: { UserId } },
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
                                _id: null,
                                Total: { $sum: "$SubTotal" }
                            }
                        }
                    ]
                }
            }
        ]);

        res.json({ UserCart });
    } catch (error) {
        console.error(error);
        res.status(500).json("Error calculating total");
    }
};

export { addcart, editcart, delcart, Total };
