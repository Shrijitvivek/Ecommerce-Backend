

import adminModel from '../models/adminsch.js'
import bcrypt from 'bcrypt'


 
const adlogin = async (req, res) => {
  const { email, password } = req.body;
  const adminFound = await adminModel.findOne({ email });

  if (!adminFound){
   res.json({message:' not found'})
  }


  const passwordMatched = await bcrypt.compare(password, adminFound.password);
  if (!passwordMatched){
   res.json({message:'Incorrect paswword'})
  }

  if(passwordMatched) {
    req.session.admin = {
    email: adminFound.email,
    id: adminFound.id
  }
  res.json({message:"admin logged in"})
  }
}

export {adlogin}