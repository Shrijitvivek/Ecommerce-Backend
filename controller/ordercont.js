import cartModel from "../models/cartsch.js";
import productModel from "../models/prodsch.js";
import OrderModel from "../models/ordersch.js";


 const addOrder = async (req, res) => {
  const userId = req.session.user.id;
  const cart = await cartModel.findOne({ UserId : userId });

  if (!cart) {
    return res.json({ message: "Cart is empty" });
  }

  let total = 0;
  const items = [];

  for (let item of cart.Items) {
    const product = await productModel.findById(item.ProductId);
    if (!product) continue;

    const subtotal = product.Price * item.Quantity;
    total += subtotal;

    items.push({
      ProductName: product.ProductName,
      Price: product.Price,
      Quantity: item.Quantity,
      SubTotal: subtotal
    });
  }

  await OrderModel.create({
    UserId: userId,
    Items: items,
    Total: total
  });

  await cartModel.deleteOne({ UserId:userId });

  res.json({ message: "Order placed" });
};

 const getadm = async (req, res) => {
  try {
    const orders = await OrderModel.find();
    res.json(orders);
  } catch (err) {
    res.json({ error: "Failed to fetch orders" });
  }
};




 const updOrder = async (req, res) => {
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
    res.json({ error: "Error updating order" });
  }
};

 const delOrder = async (req, res) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.json({ error: "Error deleting order" });
  }
};


 const getsuser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const orders = await OrderModel.find({ UserId: userId });
   res.json(orders)
   
  } catch (err) {
    res.json({ error: "Error fetching user's orders" });
  }
};


 const getIduser = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const order = await OrderModel.findOne({ _id: req.params.id, UserId: userId });

    if (!order) return res.json({ message: "Order not found " });

    res.json(order);
  } catch (err) {
    res.json({ error: "Error fetching order" });
  }
};

export {addOrder,updOrder,delOrder,getIduser,getadm,getsuser}