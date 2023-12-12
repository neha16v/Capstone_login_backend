import mongoose from 'mongoose'

const userScheme=new mongoose.Schema({
    username:String,
    email:{type:String,unique:true},
    password:String,

})

const User=mongoose.model("User",userScheme)

export default User