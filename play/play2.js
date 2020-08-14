require('../mongoose1')
const Task = require('../models/task')
// User.findById('5eeb20a3cd419c0fd0ae7daf').then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:10})
// }).then((resu)=>{
// console.log(resu)
// }).catch((e)=>{
// console.log(e)
// })
const deleted = async (completed,id)=>{
    const tsk = await Task.findByIdAndDelete(id)
    const ac = await Task.countDocuments({completed})
    return ac
}
deleted(false,'5eeb2a197259592ba07a9b28').then((results)=>{
    console.log(results)
}).catch((e)=>{
    console.log(e)
})