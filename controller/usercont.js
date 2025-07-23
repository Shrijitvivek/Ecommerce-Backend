import userModel from '../models/usersch.js'
import bcrypt from 'bcrypt'


 
const register = async (req,res)=>{
  
  let pic = "";
  if(req.file){
     pic = req.file.filename;
  }
     const { name, email, password} = req.body
  const hashed = await bcrypt.hash(password, 10)
  await userModel.create({
    name: name,
    email: email,
    password: hashed,
    image:pic
  })
    res.json({message:"User registered succesfully"})
}

const login = async (req, res) => {
  const { email, password } = req.body;
  const userFound = await userModel.findOne({ email });

  if (!userFound){
   res.json({message:'User not found'})
  }


  const passwordMatched = await bcrypt.compare(password, userFound.password);
  if (!passwordMatched){
   res.json({message:'Incorrect paswword'})
  }

  if(passwordMatched) {
    req.session.user = {
       id: userFound._id,
    name: userFound.name,
    email: userFound.email
   
  }
  res.json({message:"User logged in"})
  }
}

const lout = async (req,res)=>{
  req.session.destroy ((err)=>{
    if(err){
      res.json({message:"Session could not be destroyed"})
    }
    else{
      res.json({message:'User logged out , Session destroyed'})
    }
  })
}


export {register,login,lout}

