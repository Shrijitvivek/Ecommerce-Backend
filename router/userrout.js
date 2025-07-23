import express from 'express'
import {register,login,lout} from '../controller/usercont.js'
import{getprod,getprodid} from '../controller/prodcont.js'
import { userShowCat } from '../controller/catcont.js'
import { addcart } from '../controller/cartcont.js'
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

router.get('/products',getprod)

router.get('/products/:id',getprodid)

router.get('/categories',userShowCat)

router.use((req,res,next)=>{
  if(req.session.user){
    next()
  }
  else{
    res.json('User not logged in')
  }
})


router.get('/logout',lout)

router.post('/cart',addcart)

export default router