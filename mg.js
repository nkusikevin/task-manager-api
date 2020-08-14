const mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mydb',{useNewUrlParser:true,useUnifiedTopology:true})
const user =mongoose.model('user',{
    name:{
        type:String,

    },
    age:{
        type:Number,

    }
})
// const me=new user({
//     name:'kevin',
//     age:23
// })
// me.save().then((resu)=>{
//     console.log(resu)
// }).catch((error)=>{
//     console.log(error)
// })
const tasks =mongoose.model('tasks',{
    description:{
        type:String,
    },
    completed:{
        type:Boolean,
    }

})
const tsk= new tasks({
    description:'udemy coures',
    completed:false
})
tsk.save().then((res)=>{
    console.log(res)
}).catch((error)=>{
    console.log(error)
})