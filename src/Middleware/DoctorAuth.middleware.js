import { asyncHandler } from "../Util/Asynchandler.utils.js"
import { ApiError } from "../Util/ApiError.utils.js";
import jwt from "jsonwebtoken";
import { Doctor } from "../Models/doctor.models.js";


export const verifyDoctorJWT = asyncHandler(async (req,res,next) => {
    try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer "," ");
  
      if (!token) {
        throw new ApiError(401,"unAuthorised request")
      }
  
      const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECREAT);
  
      const doctor = await Doctor.findById(decodedToken?._id).select("-password -refreshToken");
  
      if (!doctor) {
         throw new ApiError(401,"invalid access token")
      }
  
      req.doctor = doctor;
      next(); 
    } catch (error) {
      throw new ApiError(401, error?.message || "invalid access Token")
    }
})