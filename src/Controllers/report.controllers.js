import { ApiError } from "../Util/ApiError.utils.js";
import { ApiResponse } from "../Util/ApiResponse.utils.js";

// 

const GetPatientReport = (async(req,res,next)=>{
  try {
    const patient = req.patient;

    const report = await patient.populate("reports").execPopulate();

    if(!report){
      throw new ApiError(500,"Something Went Wrong while fetching Reports");
    }

    res.json(new ApiResponse(200,report,"Reports Fetched Successfully"));

  } catch (error) {
    next(error)
  }
})
export { GetPatientReport };
