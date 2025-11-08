import userModel from '../models/usersch.js';
import adminModel from '../models/adminsch.js'
import prodModel from '../models/prodsch.js';
import OrderModel from '../models/ordersch.js';
import categoryModel from '../models/catsch.js';

import bcrypt from 'bcrypt'



const adlogin = async (req, res) => { // admin login
  const { email, password } = req.body;
  const adminFound = await adminModel.findOne({ email });

  if (!adminFound) {
   return res.json({ message: ' not found' })
  }


  const passwordMatched = await bcrypt.compare(password, adminFound.password);
  if (!passwordMatched) {
    return res.json({ message: 'Incorrect paswword' })
  }

  if (passwordMatched) {
    req.session.admin = {
      email: adminFound.email,
      id: adminFound.id
    }
   return res.json({ message: "admin logged in",message1:true })
  }
}

const getUser = async (req, res) => { //  get all user
  try {
    const find = await userModel.find()
    res.json({users:find})
  }

  catch (err) {
    console.log(err)
    res.json('User not found');

  }
}

const toggleUserStatus = async (req, res) => { // user status change
  try {
    const { status } = req.body; 
    const userId = req.params.id;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User status updated", user: updatedUser });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating status" });
  }
};

 const getDashboardCounts = async (req, res) => { //count everything 
  try {
    const [products, orders, users, categories] = await Promise.all([
      prodModel.countDocuments(),
      OrderModel.countDocuments(),
      userModel.countDocuments(),
      categoryModel.countDocuments(),
    ]);

    res.json({
      products,
      orders,
      users,
      categories,
    });
  } catch (error) {
    console.error("Error fetching dashboard counts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const adlout = async (req, res) => {
  req.session.admin = null
  if(req.session.admin === null){
       res.json({ message: 'Admin logged out ' })
    }
    else {
      res.json({ message: "Failed to logout" })
    }
  }

export { adlogin, adlout, getUser , toggleUserStatus , getDashboardCounts}