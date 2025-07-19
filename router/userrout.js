import express from 'express'
import {register,login} from '../controller/usercont.js'
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

export default router