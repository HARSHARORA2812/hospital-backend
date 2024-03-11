import e from "express";
import { Patient } from "../Models/patient.models.js";
import { ApiError } from "../Util/ApiError.utils.js";
import { ApiResponse } from "../Util/ApiResponse.utils.js";

const GenerateAccessAndRefreshToken = (async(userId)=>{
  try {
     
   const patient = await Patient.findById(userId);

    const accessToken = patient.generateAccessToken();
    const refreshToken = patient.generateRefreshToken();

    patient.refreshToken = refreshToken;

    await patient.save({ validateBeforeSave : false })

    return {accessToken , refreshToken}
      

  } catch (error) {
     throw new ApiError(500,"Something Went Wrong while generating access and refresh tokens");
  }
})

const RegisterPatient = (async(req,res,next)=>{

  try {
    const {name , adhaarNumber , desease , email , mobileNumber , password} = req.body;

    if(!name || !adhaarNumber || !desease || !email || !mobileNumber || !password){
      throw new ApiError(400,"Please Provide all the required fields");
    }

    const existUser = await Patient.findOne(

      {$or : [{email},{adhaarNumber},{mobileNumber}]}
      
      )
    if(existUser){
      throw new ApiError(400,"User Already Exist with this Email or Adhaar Number or Mobile Number");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    const avatar = await uploadOnCloudibary(avatarLocalPath);

    if(!avatar){
      throw new ApiError(500,"Something Went Wrong while uploading Avatar");
    }


    const patient = await Patient.create({name , desease , email , adhaarNumber , mobileNumber , password , avatar : avatar.url})

    const createdUser = await findById(patient._id).seclect("-password")

    const {accessToken , refreshToken} = await GenerateAccessAndRefreshToken(patient._id);

    const response = new ApiResponse(201,{user : createdUser , accessToken , refreshToken},"Patient Registered Successfully");

    res.status(201).json(response);
  
}
  catch (error) {
    next(error)
 }
})

const LoginPatient = (async(req,res,next)=>{
  // get password and email from req.body
  // match password
  // generate access and refresh token
  // send response with access and refresh token
  // send response 

  const {email , password } = req.body;

  if(!email || !password){
    throw new ApiError(400,"Please Provide Email and Password");
  }

  if(!email.includes("@")){
    throw new ApiError(400,"Please Provide a valid Email");
  }
  
  const patient = await Patient.findOne({email});

  if(!patient){
    throw new ApiError(400,"User Not Found with this Email");
  }

  const isMatch = await patient.matchPassword(password);

  if(!isMatch){
    throw new ApiError(400,"Invalid Password");
  }

  const {accessToken , refreshToken} = await GenerateAccessAndRefreshToken(patient._id);

  const response = new ApiResponse(200,{accessToken , refreshToken},"Login Successfully");

  res.status(200).json(response);

})

export {
  RegisterPatient,
  GenerateAccessAndRefreshToken,
  LoginPatient
}