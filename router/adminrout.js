import express from 'express'
import {adlogin} from '../controller/admincont.js'

const adrouter = express.Router()

adrouter.post('/admin/login',adlogin)

export default adrouter