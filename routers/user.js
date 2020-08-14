const express = require('express')
const multer = require('multer')
const sharp =require('sharp')
const {sendwelcomeemail}= require('../emails/account')
const {emailcancle}= require('../emails/account')
const User = require('../models/user')
const auth = require('../middleware/auth')
// const user = require('../models/user')
const router = new express.Router()
router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try {
        await user.save()
        sendwelcomeemail(user.email,user.name)
        const tok= await user.generatetoken()
        res.status(201).send({user,tok})
    } catch (error) {
        res.status(400).send(error)
    }
    })
    router.post('/users/login', async (req, res) => {
        
       try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generatetoken()
        res.send({user,token})
       } catch (error) {
           res.status(400).send(error)
       }
    })
   router.get('/users/me',auth,async (req,res)=>{
     try {
        res.send(req.user)
     } catch (error) {
         res.status(500).send(error)
     }
    })
    router.post('/users/logout',auth, async(req,res)=>{
        try {
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })
            await req.user.save()
            res.send()
        } catch (error) {
            res.status(500).send()
        }
    })
    router.post('/users/logoutall',auth,async(req,res)=>{
        try {
            req.user.tokens = []
            await req.user.save()
            res.send()
        } catch (e) {
            res.status(500).send(e)
        }
    })
    router.patch('/users/update_me',auth, async (req,res)=>{
        const updates=Object.keys(req.body)
        const allowed =['name','email','password','age']
        const valid = updates.every((update) => allowed.includes(update))
        if(!valid){
            return res.status(404).send({error:'invalid update'})
        }
        try {
    updates.forEach((update) => req.user[update]= req.body[update])
    await req.user.save()
        res.send(req.user)
        } catch (e) {
        res.status(400).send(e)
        }
    })
   router.delete('/users/delete_me',auth,async (req,res)=>{
        try {
        await req.user.remove()
        emailcancle(req.user.email,req.user.name)
        res.send(req.user).status(200)
        } catch (e) {
        res.status(500).send(e)
        }
    })
   
   router.delete('/user/me/avatar',auth, async(req,res)=>{
       req.user.avatar=undefined
       await req.user.save()
       res.send()
   }) 
   router.get('/user/:id/avatar',async(req,res)=>{
       try {
           const user =   await User.findById(req.params.id)
           if(!user||!user.avatar){
               throw new Error()
           }
           res.set('Content-Type','image/png')
           res.send(user.avatar)
       } catch (error) {
           res.status(404).send()
       }

   })
   const upload = multer({
    limits:{
        filesize:2000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)){
             return cb(new Error('nigger can you pls attach the right type of file'))
        }
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar') , async(req,res)=>{
    const buffer= await sharp(req.file.buffer).resize({width:250 , height:250}).png().toBuffer()
     req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
res.status(400).send({error: error.message})
})
module.exports= router