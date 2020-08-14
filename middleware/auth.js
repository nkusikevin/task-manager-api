const jwt =require('jsonwebtoken')
require('dotenv').config({path:'./config/dev.env'})
const User = require('../models/user')
const auth = async (req ,res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode= jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decode._id,'tokens.token':token})
        if(!user){
            throw new Error()
        }
        req.token = token
        req.user=user
        next()
    } catch (e) {
        res.status(404).send({error:'please your not authenticated'})
    }

}
module.exports=auth