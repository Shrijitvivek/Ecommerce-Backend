import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import router from './router/userrout.js'
import adrouter from './router/adminrout.js'
import session from 'express-session'
import MongoStore  from 'connect-mongo'
import cors from 'cors'
dotenv.config()


const app = express()
app.use(express.static('prodimg'))
app.use(express.static('upload'))
app.use(cors({
    origin:'http://localhost:5174',
    credentials:true
}))

app.use(express.json())

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,        // true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'       // or 'none' if using HTTPS
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/BackendEcommerce',
        collectionName: 'sessions'

  })
}))


app.use('/admin',adrouter)
app.use('/user',router)



mongoose.connect(process.env.db_URL).then(()=>{
    console.log('db connected')
    
})

app.listen(process.env.PORT,()=>{
    console.log('Server started');
    
})