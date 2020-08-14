require('../mongoose1')
const User = require('../models/user')
User.findByIdAndUpdate('5eeb20a3cd419c0fd0ae7daf',{age:10}).then((user)=>{
    console.log(user)
    return User.countDocuments({age:10})
}).then((rest)=>{
    console.log(rest)

}).catch((e)=>{
    console.log(e)
})
