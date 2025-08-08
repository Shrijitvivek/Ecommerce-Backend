import express from 'express'
import {register,login,editUser,lout} from '../controller/usercont.js'
import{getproduser,getprodiduser} from '../controller/prodcont.js'
import { userShowCat } from '../controller/catcont.js'
import { addcart ,Total , editcart , delcart} from '../controller/cartcont.js'
import { addOrder,getIduser,getsuser } from '../controller/ordercont.js'
import multer from 'multer'
import path from 'path'
 

const router = express.Router()

const storage = multer.diskStorage({
  destination:function(req,file,callback){
    callback(null,'upload')
  },
  filename:function(req,file,callback){
    const name = Date.now()+path.extname(file.originalname)
  callback(null,name)
  }
})

const upload = multer({storage})

router.post('/register',upload.single('image'),register)

router.post('/login',login)

router.get('/products',getproduser)

router.get('/products/:id',getprodiduser)

router.get('/categories',userShowCat)




router.use((req,res,next)=>{
  if(req.session.user){
    next()
  }
  else{
    res.json('User not logged in')
  }
})



router.post('/cart',addcart)

router.put('/edit/:id',upload.single("image"),editUser)

router.get('/cart',Total)

router.put('/cart/:id',editcart)

router.delete('/cart/:id',delcart)

router.get('/logout',lout)

router.post("/orders",addOrder)

router.get('/orders',getsuser)

router.get('/orders/:id',getIduser)

export default router