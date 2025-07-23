import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addprod,
  getprod,
  updprod,
  delprod,
  getprodid
} from '../controller/prodcont.js';
import { adlogin,adlout } from '../controller/admincont.js';
import {showcat,addcat,delcat,updcat,userShowCat} from '../controller/catcont.js'

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

// Admin  routes
adrouter.post('/admin/login', adlogin);
adrouter.get("/admin/logout",adlout)

adrouter.use((req,res,next)=>{
  if(req.session.admin){
    next()
  }
  else{
    res.json('admin not logged in ')
  }
})

// Product CRUD routes
adrouter.post('/admin/products', produpl.single('ProductImage'), addprod);       
adrouter.get('/admin/products', getprod);                                   
adrouter.put('/admin/products/:id', produpl.single('ProductImage'), updprod); 
adrouter.get('/admin/products/:id',getprodid)
adrouter.delete('/admin/products/:id', delprod);    

// Category CRUD routes
adrouter.get('/admin/categories',showcat)
adrouter.post('/admin/categories',addcat)
adrouter.put('/admin/categories/id',updcat)
adrouter.delete('/admin/categories/id',delcat)

export default adrouter;
