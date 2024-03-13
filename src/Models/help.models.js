import mongoose , { Schema } from "mongoose";

const helpSchema = new Schema({
    
  location : {
    type : String,
    require : true,
    lowecase : true,
  },
  phoneNumber : {
    type : Number,
    require : true,
    unique : true,
  },
   details : {
    type : String,
    require : true,
   },
   name : {
    type : String,
    require : true,
   },

}, {timestamps : true})

export const Help = mongoose.model("Help" , helpSchema)