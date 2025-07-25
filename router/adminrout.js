import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addprod,
  getprodadm,
  updprod,
  delprod
} from '../controller/prodcont.js';
import { adlogin,adlout,getUser } from '../controller/admincont.js';
import {showcat,addcat,delcat,updcat,userShowCat} from '../controller/catcont.js'
import { updOrder,delOrder,getadm } from '../controller/ordercont.js';

const adrouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'prodimg');
  },
  filename: function (req, file, callback) {
    const prod = Date.now() + path.extname(file.originalname);
    callback(null, prod);
  }
});

const produpl = multer({ storage });


adrouter.post('/login', adlogin);



adrouter.use((req,res,next)=>{
  if(req.session.admin){
    next()
  }
  else{
    res.json('admin not logged in ')
  }
})

// Product CRUD routes
adrouter.get('/products', getprodadm);  

adrouter.post('/products', produpl.single('ProductImage'), addprod);       
                                 
adrouter.put('/products/:id', produpl.single('ProductImage'), updprod); 

adrouter.delete('/products/:id', delprod);    

// Category CRUD routes
adrouter.get('/categories',showcat)

adrouter.post('/categories',addcat)

adrouter.put('/categories/:id',updcat)

adrouter.delete('/categories/:id',delcat)

adrouter.get('/users',getUser)

adrouter.get("/logout",adlout)

// Order routes
adrouter.get('/orders',getadm)

adrouter.put('/orders/:id',updOrder)

adrouter.delete('/ordrs/:id',delOrder)

export default adrouter;
