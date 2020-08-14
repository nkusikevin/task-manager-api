const {MongoClient,ObjectID}=require('mongodb')
const connectionUrl='mongodb://127.0.0.1:27017'
const databasename='task-mgr'
const id=new ObjectID()
console.log(id)
console.log(id.getTimestamp())
MongoClient.connect(connectionUrl,(error,client)=>{
    if(error){
        return console.log("unable to connect")
    }
    const db=client.db(databasename)
//   db.collection('mytasks').updateMany({
//       completed:false
//   },{
//       $set:{
//           completed:true
//       }
//   }).then((results)=>{
//       console.log(results.modifiedCount)
//   })
db.collection('mytasks').deleteOne({
    description : "setting channel gingles",
}).then((results)=>{
    console.log(results)
}).catch((error)=>{
    console.log(error)
})
})