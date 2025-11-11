import express from 'express'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import router from './router/userrout.js'
import adrouter from './router/adminrout.js'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'
dotenv.config()


const server = express()
const app = express.Router();

server.use(cors({
  origin: [
    "http://16.16.24.28",
    "http://localhost:5173"
  ],
  credentials: true
}))
server.use(express.json())
server.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/BackendEcommerce',
    collectionName: 'sessions'
  })
}))

app.use('/prodimg',express.static('prodimg')) // prodimg file static serve 
app.use('/upload', express.static('upload')) // userimg file static serve
app.use('/admin', adrouter)
app.use('/user', router)

server.use("/api", app)


mongoose.connect(process.env.db_URL)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


server.listen(process.env.PORT, () => {
  console.log('Server started');             
})