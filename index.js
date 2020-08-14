const express = require('express')
require('./mongoose1')
const taskroute= require('./routers/task')
const usersroute= require('./routers/user') 
require('dotenv').config({path:'./config/dev.env'})
const app=express()
const port=process.env.PORT||3000
app.use(express.json())
app.use(taskroute)
app.use(usersroute)
app.listen(port,()=>{
    console.log('server connected on port '+port)
})