import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import router from './router/userrout.js'
import adrouter from './router/adminrout.js'
import session from 'express-session'
import MongoStore  from 'connect-mongo'
dotenv.config()


const app = express()

app.use(express.json())

app.use(session({
    secret:"key",
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:"mongodb://localhost:27017/BackendEcommerce",
        collectionName:"Sessions"
    })

}))

app.use('',router)
app.use('',adrouter)



mongoose.connect(process.env.db_URL).then(()=>{
    console.log('db connected')
    
})

app.listen(process.env.PORT,()=>{
    console.log('Server started');
    
})