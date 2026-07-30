// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const mongoDb = require('./config/mongoDb')
const authRoute = require('./routes/authRoute')
const app = express()

mongoDb()

app.use(express.json())

app.use('/api/v1/auth', authRoute)

app.listen(5000,()=>{
    console.log("Server is running")
})