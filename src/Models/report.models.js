import mongoose , { Schema } from "mongoose"

const reportSchema = new Schema({
    patient : {
      type : Schema.Types.ObjectId,
      ref : "Patient"
    },
    desies : {
      type : String,
      require : true,
    },
    date : {
      type : String,
      require : true,
    },
  
},{timestamps : true})

export const Report = mongoose.model("Report" , reportSchema)