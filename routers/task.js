const express = require('express')
const Task = require('../models/task') 
const auth = require('../middleware/auth')
const router = new express.Router()
router.patch('/task/:id',auth ,async (req,res)=>{
    const updates =Object.keys(req.body)
    const valid =['description','completed']
    const isval= updates.every((updates)=> valid.includes(updates))
    if(!isval){
        return res.status(404).send({error:'no task found'})
    }
    try {
   const tsk =  await Task.findOne({_id:req.params.id , owner:req.user.id})
    if(!tsk){
        return res.status(404).send({error:'NO TASK FOUND TO UPDATE'})
    }
    updates.forEach((update)=> tsk[update]= req.body[update])
    await tsk.save()
    res.status(200).send(tsk)
    } catch (e) {
    res.status(404).send(e)
    }
})
router.post('/task',auth, async(req,res)=>{
const tsk = new Task({
    ...req.body,
    owner:req.user._id
})
try {
await tsk.save()
res.status(201).send(tsk)
} catch (e) {
res.status(500).send(e)
}

})
router.get('/task',auth,async (req,res)=>{
    const match ={}
    const sort ={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1]==='desc'? -1 : 1
    }
   try {
//    const ysk = await Task.find({owner:req.user._id})
   await req.user.populate({path:'tasks',
        match, 
        options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }}).execPopulate()
   res.status(201).send(req.user.tasks)
   } catch (e) {
   res.status(404).send(e)
   }

router.get('/task/:id',auth,async(req,res)=>{
    console.log("ok1")
    const _id = req.params.id
    
 try {
 const tsk = await Task.findOne({_id, owner:req.user._id})
 console.log("ok14"+tsk)
 if (!tsk){
    console.log("o1")
     res.status(404).send()
 }
 res.status(200).send(tsk)
 } catch (e) {
 res.status(500).send(e)
 }
})   

})
router.delete('/task/:id',auth,async (req,res)=>{
    try {
    const del = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if (!del){
        return res.status(404).send()
    }
    res.status(200).send(del)
    } catch (e) {
    res.status(500).send({error:'no task found'})
    }
})
module.exports= router