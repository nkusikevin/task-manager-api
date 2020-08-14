const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
require('dotenv').config({path:'./config/dev.env'})
const jwt = require('jsonwebtoken')
const Task = require('../models/task')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON = function(){
    const user = this
    const userobj= user.toObject()
    delete userobj.password
    delete userobj.tokens
    delete userobj.avatar
    return userobj
}
userSchema.methods.generatetoken= async function(){
    const user=this
    const token = jwt.sign({_id:user.id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
} 
userSchema.statics.findByCredentials = async (email, password) => {
    const users = await user.findOne({ email })
    if (!users) {
        console.log('middle ware error')
        throw new Error('Unable to login')
        
    }
    const isMatch = await bcrypt.compare(password, users.password)
    if (!isMatch) {
        console.log('middle ware pass error')
        throw new Error('Unable to login')
    }
    return users
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})
userSchema.pre('remove', async function(next){
const user = this
await Task.deleteMany({owner:user._id})
next()
} )
const user = mongoose.model('User', userSchema)
module.exports = user