import mongoose , { Schema } from "mongoose"

const appointmentSchema = new Schema({
     patient : {
       type : Schema.Types.ObjectId,
       ref : "Patient"
     },
     doctor : {
      type : Schema.Types.ObjectId,
      ref : "Doctor"
     },
     time : {
       type : String,
       require : true,
     },
     date : {
       type : String,
       require : true,
     }
},{timestamps  :true})

export const Appointment = mongoose.model("Appointment" , appointmentSchema)