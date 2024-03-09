import { asyncHandler } from "../Util/Asynchandler.utils.js"
import { ApiError } from "../Util/ApiError.utils.js";
import jwt from "jsonwebtoken";
import { Patient } from "../Models/patient.models.js";


export const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer "," ");
  
      if (!token) {
        throw new ApiError(401,"unAuthorised request")
      }
  
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECREAT);
  
      const patient = await Patient.findById(decodedToken?._id).select("-password -refreshToken");
  
      if (!patient) {
         throw new ApiError(401,"invalid access token")
      }
  
      req.patient = patient;
      next(); 
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid access Token")
    }
})