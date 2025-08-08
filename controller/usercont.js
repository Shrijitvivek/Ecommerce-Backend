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
   return res.json({message:'User not found'})
  }


  const passwordMatched = await bcrypt.compare(password, userFound.password);
  if (!passwordMatched){
   return res.json({message:'Incorrect paswword'})
  }

  if(passwordMatched) {
    req.session.user = {
       id: userFound._id,
    name: userFound.name,
    email: userFound.email
   
  }
 return res.json({message:"User logged in"})
  }
}

 const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const oldUser = await userModel.findById(userId);
    if (!oldUser) {
      return res.status(404).json({ message: "user Not found" });
    }
    const dataToBeUpdated = {
      name: oldUser.name,
      email: oldUser.email,
      image: oldUser.image,
    };

    if (req.body.name) {
      dataToBeUpdated.name = req.body.name;
    }
    if (req.body.email) {
      dataToBeUpdated.email = req.body.email;
    }
    if (req.file) {
      dataToBeUpdated.image = req.file.filename;
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      dataToBeUpdated
    );
    res.json({ message: "User details updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "somthing wrong" });
  }
};

const lout = async (req,res)=>{
 req.session.user = null
  if(req.session.user === null){
       res.json({ message: 'User logged out ' })
    }
    else {
      res.json({ message: "Failed to logout" })
    }
  }


export {register,login,editUser,lout}

