const sgmail = require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_APIKEY)
const sendwelcomeemail = (email,name)=>{
    sgmail.send({
        to:email,
        from:'nkusikevin24@gmail.com',
        subject:"hello thanks for joining us",
        text:`welcome to the app ${name}`
    })
}
const emailcancle = (email,name)=>{
    sgmail.send({
        to:email,
        from:'nkusikevin24@gmail.com',
        subject:"Ooooh my God you just left us",
        text:`Hello ${name} please tell us what amde you go away from us`
    })



}
module.exports={
    sendwelcomeemail,
    emailcancle
}