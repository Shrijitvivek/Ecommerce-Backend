import userModel from '../models/usersch.js';
import adminModel from '../models/adminsch.js'
import bcrypt from 'bcrypt'



const adlogin = async (req, res) => {
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
   return res.json({ message: "admin logged in" })
  }
}

const getUser = async (req, res) => {
  try {
    const find = await userModel.find()
    res.json(find)
  }

  catch (err) {
    console.log(err)
    res.json('User not found');

  }
}

const adlout = async (req, res) => {
  req.session.admin = null
  if(req.session.admin === null){
       res.json({ message: 'Admin logged out ' })
    }
    else {
      res.json({ message: "Failed to logout" })
    }
  }

export { adlogin, adlout, getUser }