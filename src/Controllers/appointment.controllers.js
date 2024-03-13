import { Patient } from "../Models/patient.models.js";
import { ApiError } from "../Util/ApiError.utils.js";
import { ApiResponse } from "../Util/ApiResponse.utils.js";
import { Doctor } from "../Models/doctor.models.js";
import { Appointment } from "../Models/Appointment.models.js";

const GetDoctorAppointments = (async(req,res,next)=>{

  const { date , time } = req.body;

  if(!date || !time){
    throw new ApiError(400,"Please Provide Date and Time");
  }

  const patient = req.patient;

  if(!patient){
    throw new ApiError(400,"Please Provide Patient");
  }

  const { desease } = patient;

  if(!desease){
    throw new ApiError(400,"Please Provide Desease");
  }

  const doctor = await Doctor.findOne({specialization : desease});
  
  if(!doctor){
    throw new ApiError(404,"Doctor Not Found with this Desease");
  }

  const doctorNotAvalable = Appointment.findOne({date , time , doctor : doctor._id});

  if(doctorNotAvalable){
    throw new ApiError(400,"Doctor Not Available at this Date and Time");
  }
  
  const appointment = Appointment.create({date , time , patient : patient._id , doctor : doctor._id});
  
  if (!appointment) {
    throw new ApiError(500,"Something Went Wrong while creating Appointment");
  }

  res.json(new ApiResponse(200,appointment,"Appointments Successfully Registered"));

})

const GetPatientAppointments = (async(req,res,next)=>{
  try {
    const patient = req.patient;

    const appointment = await patient.populate("appointments").execPopulate();

    if(!appointment){
      throw new ApiError(500,"Something Went Wrong while fetching Appointments");
    }

    res.json(new ApiResponse(200,appointment,"Appointments Fetched Successfully"));

  } catch (error) {
    next(error)
  }
})

export { GetDoctorAppointments, GetPatientAppointments };