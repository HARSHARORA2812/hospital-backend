import mongoose , { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const doctorSchema = new Schema({
   
  name : {
    type : String,
    require : true,
    lowecase : true,
  },
  specialization : {
    type : String,
    require : true,
  },
  adhaarNumber : {
    type : Number,
    require : true,
    unique : true,
  },
  mobileNumber : {
    type : Number,
    require : true,
    unique : true,
  },
  // avatar : {
  //   type : String,
  //   require : true,
  //   unique : true,
  // },
  email : {
    type : String,
    require :true ,
    unique : true,
  },
  password : {
    type : String,
    require : true,
  },
  refreshTocken : {
    type : String,
  }
  
},{timestamps : true})

doctorSchema.pre("save" ,async function (next) {
  if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
   next()
})

doctorSchema.methods.isPasswordCorrect = async function (password){
  return await bcrypt.compare(password,this.password)
}

doctorSchema.methods.generateAccessToken =  function (){
  return jwt.sign(
   {
     id : this._id,
     email : this.email,
     name : this.name,
   }
   ,process.env.ACCESS_TOKEN_SECREAT,
   {
     expiresIn : "process.env.ACCESS_TOKEN_EXPIRY"
   })
}

doctorSchema.methods.generateRefreshToken =  function (){
 return jwt.sign(
   {
     id : this._id,
   }
   ,process.env.REFRESH_TOKEN_SECREAT,
   {
     expiresIn : "process.env.REFRESH_TOKEN_EXPIRY"
   })
}

export const Doctor = mongoose.model("Doctor" , doctorSchema)