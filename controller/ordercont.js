import cartModel from "../models/cartsch.js";
import productModel from "../models/prodsch.js";
import OrderModel from "../models/ordersch.js";
import userModel from "../models/usersch.js";

// CREATE Order




export const addOrder = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cart = await cartModel.findOne({ UserId: userId });

    if (!cart || cart.Items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;
    const orderItems = [];

    for (let item of cart.Items) {
      const product = await productModel.findById(item.ProductId);
      if (!product) continue;

      const subtotal = product.Price * item.Quantity;
      total += subtotal;

      orderItems.push({
        ProductName: product.ProductName,
        Price: product.Price,
        Quantity: item.Quantity,
        SubTotal: subtotal
      });
    }

    const newOrder = new OrderModel({
      UserId: userId,
      Items: orderItems,
      Total: total,
      DeliveryStatus: "Pending"
    });

    await newOrder.save();

    await cartModel.deleteOne({ UserId: userId });

    res.json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

     

export const getadm = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    const ordersWithUsernames = [];

    for (let order of orders) {
      const user = await userModel.findById(order.UserId);
      ordersWithUsernames.push({
        ...order._doc,
        UserName: user ? user.name : "Unknown"
      });
    }

    res.json(ordersWithUsernames);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

// READ - Single user all orders
export const getsuser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const orders = await OrderModel.find({ UserId: userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user's orders" });
  }
};

// READ - Single order of a user
export const getIduser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const order = await OrderModel.findOne({ _id: req.params.id, UserId: userId });

    if (!order) return res.json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Error fetching order" });
  }
};

// UPDATE delivery status
export const updOrder = async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    const updated = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { DeliveryStatus: deliveryStatus },
      { new: true }
    );

    if (!updated) return res.json({ message: "Order not found" });

    res.json({ message: "Delivery status updated", order: updated });
  } catch (err) {
    res.status(500).json({ error: "Error updating order" });
  }
};

// DELETE order
export const delOrder = async (req, res) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting order" });
  }
};