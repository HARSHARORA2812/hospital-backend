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

// start patient creation

const RegisterPatient = (async(req,res,next)=>{

  try {
    const {name , adhaarNumber , desease , email , mobileNumber , password} = req.body;

    if(!name || !adhaarNumber || !desease || !email || !mobileNumber || !password){
      throw new ApiError(400,"Please Provide all the required fields");
    }

    const existPatient = await Patient.findOne(

      {$or : [{email},{adhaarNumber},{mobileNumber}]}
      
      )
    if(existPatient){
      throw new ApiError(400,"User Already Exist with this Email or Adhaar Number or Mobile Number");
    }

    // const avatarLocalPath = req.files?.avatar[0]?.path;

    // if(!avatarLocalPath){
    //   throw new ApiError(400,"Please Provide Avatar");
    // }

    // const avatar = await uploadOnCloudibary(avatarLocalPath);

    // if(!avatar){
    //   throw new ApiError(500,"Something Went Wrong while uploading Avatar");
    // }


    const patient = await Patient.create({name , desease , email , adhaarNumber , mobileNumber , password })

    const createdPatient = await Patient.findById(patient._id).seclect("-password")

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

  const response = new ApiResponse(200,{patient ,accessToken , refreshToken},"Login Successfully");

  res.status(200).
  cookie("refreshToken",refreshToken).
  cookie("accessToken",accessToken).
  json(response);

})

const LogoutPatient = (async(req,res,next)=>{
    const patient = req.patient;

    if(!patient){
      throw new ApiError(400,"Please Login First");
    }

    patient.refreshToken = null;
    patient.accessToken = null;

    await patient.save({ validateBeforeSave : false });

    res.status(200)
    .cookie("refreshToken","")
    .refreshToken("accessToken","")
    .json(
      new ApiResponse(200,{},"Logout Successfully")
    )
})

const refreshAccessToken = (async(req,res,next)=>{
  // get refresh token from cookie
  // check if refresh token is valid
  // generate new access token
  // send response with new access token

  const incomingRefreshToken = req.cookies.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError(400,"Please Provide Refresh Token");
  }

  const decodedToken = await jwt.verify(incomingRefreshToken,process.env.JWT_SECRET);

  if(!decodedToken){
    throw new ApiError(400,"Invalid Refresh Token");
  }

  const patient = await Patient.findById(decodedToken?.id);
 
  if(!patient){
    throw new ApiError(400,"Invalid Refresh Token");
  }

  const { accessToken } = await GenerateAccessAndRefreshToken(patient._id);
  
  res.status(200).json(
    new ApiResponse(200,{accessToken},"Access Token Refreshed Successfully")
  )

})

const changeCurrentPassword = (async(req,res,next)=>{
   //get current password and new password from req.body
   //match current password
    //update new password

  try {
    const {currentPassword , newPassword} = req.body;
  
    if(!currentPassword || !newPassword){
        throw new ApiError(400,"Please Provide Current Password and New Password");
      }
  
    const patient = await findById(req.patient._id);
  
    if(!patient){
      throw new ApiError(400,"Please Login First");
    }
  
    const isMatch = await patient.isPasswordCorrect(currentPassword);
  
    if(!isMatch){
      throw new ApiError(400,"Invalid Current Password");
    }
  
    patient.password = newPassword;
  
    await patient.save({ validateBeforeSave : false });

  } catch (error) {
    throw new ApiError(500,"Something Went Wrong while changing Password");
  }

  res.status(200).json(
    new ApiResponse(200,{},"Password Changed Successfully")
  )

})

const getCurrentPatient = (async(req,res,next)=>{

   const patient = await findById(req.patient._id).seclect("-password");
   
   if(!patient){
    throw new ApiError(400,"Please Login First");

    }

    res.status(200).json(
      new ApiResponse(200,{patient},"Current User Data"))



})

const updateCurrentPatient = (async(req,res,next)=>{
  // get updated fields from req.body
  // update fields
  // send response with updated user data

  const patient = await findById(req.patient._id)

  if(!patient){
    throw new ApiError(400,"Please Login First");
  }
   
   const updatedFields = req.body;

    if(updatedFields.password || updatedFields.avatar){
      throw new ApiError(400,"you cant change password or avatar from here");
    }
  
    const { name , adhaar , email , desease} = updatedFields;

    Patient.findByIdAndUpdate(
      patient._id,
      {$set : {name , adhaar , email , desease}},
      {new : true}).select("-password")

    res.status(200).json(
      new ApiResponse(200,{patient},"User Updated Successfully")

    )

})

// const updatePatientAvatar = (async(req,res,next)=>{
     
// })




export {
  RegisterPatient,
  GenerateAccessAndRefreshToken,
  LoginPatient,
  LogoutPatient,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentPatient,
  updateCurrentPatient,
}