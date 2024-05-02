import { ApiError } from "../Util/ApiError.utils.js";
import { ApiResponse } from "../Util/ApiResponse.utils.js";
import { Doctor } from "../Models/doctor.models.js";

const GenerateAccessAndRefreshToken = (async(userId)=>{
  try {
     
   const doctor = await Doctor.findById(userId);

    const accessToken = doctor.generateAccessToken();
    const refreshToken = doctor.generateRefreshToken();

    doctor.refreshToken = refreshToken;

    await doctor.save({ validateBeforeSave : false })

    return {accessToken , refreshToken}
      

  } catch (error) {
     throw new ApiError(500,"Something Went Wrong while generating access and refresh tokens");
  }
})

// doctor creation start

const RegisterDoctor = (async(req,res,next)=>{

  try {
    const {name , adhaarNumber ,   specialization
      , email , mobileNumber , password} = req.body;

    if(!name || !adhaarNumber || !specialization || !email || !mobileNumber || !password){
      throw new ApiError(400,"Please Provide all the required fields");
    }

    const existDoctor = await Doctor.findOne(

      {$or : [{email},{adhaarNumber},{mobileNumber}]}
      
      )
    if(existDoctor){
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


    const doctor = await Doctor.create({name , specialization , email , adhaarNumber , mobileNumber , password })

    const createdDoctor = await Doctor.findById(doctor._id).seclect("-password")

    const {accessToken , refreshToken} = await GenerateAccessAndRefreshToken(doctor._id);

    const response = new ApiResponse(201,{user : createdDoctor , accessToken , refreshToken},"Doctor Registered Successfully");

    res.status(201).json(response);
  
}
  catch (error) {
    next(error)
 }
})

const LoginDoctor = (async(req,res,next)=>{
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
  
  const doctor = await Doctor.findOne({email});

  if(!doctor){
    throw new ApiError(400,"User Not Found with this Email");
  }

  const isMatch = await doctor.matchPassword(password);

  if(!isMatch){
    throw new ApiError(400,"Invalid Password");
  }

  const {accessToken , refreshToken} = await GenerateAccessAndRefreshToken(doctor._id);

  const response = new ApiResponse(200,{doctor ,accessToken , refreshToken},"Login Successfully");

  res.status(200).
  cookie("refreshToken",refreshToken).
  cookie("accessToken",accessToken).
  json(response);

})

const LogoutDoctor = (async(req,res,next)=>{
    const doctor = req.doctor;

    if(!doctor){
      throw new ApiError(400,"Please Login First");
    }

    doctor.refreshToken = null;
    doctor.accessToken = null;

    await doctor.save({ validateBeforeSave : false });

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

  const doctor = await Doctor.findById(decodedToken?.id);
 
  if(!doctor){
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
  
    const doctor = await findById(req.doctor._id);
  
    if(!doctor){
      throw new ApiError(400,"Please Login First");
    }
  
    const isMatch = await doctor.isPasswordCorrect(currentPassword);
  
    if(!isMatch){
      throw new ApiError(400,"Invalid Current Password");
    }
  
    doctor.password = newPassword;
  
    await doctor.save({ validateBeforeSave : false });

  } catch (error) {
    throw new ApiError(500,"Something Went Wrong while changing Password");
  }

  res.status(200).json(
    new ApiResponse(200,{},"Password Changed Successfully")
  )

})

const getCurrentDoctor = (async(req,res,next)=>{

   const doctor = await findById(req.doctor._id).seclect("-password");
   
   if(!doctor){
    throw new ApiError(400,"Please Login First");

    }

    res.status(200).json(
      new ApiResponse(200,{doctor},"Current User Data"))



})

const updateCurrentDoctor = (async(req,res,next)=>{
  // get updated fields from req.body
  // update fields
  // send response with updated user data

  const doctor = await findById(req.doctor._id)

  if(!doctor){
    throw new ApiError(400,"Please Login First");
  }
   
   const updatedFields = req.body;

    if(updatedFields.password ){
      throw new ApiError(400,"you cant change password from here");
    }
  
    const { name , adhaar , email , desease} = updatedFields;

    Doctor.findByIdAndUpdate(
      doctor._id,
      {$set : {name , adhaar , email , desease}},
      {new : true}).select("-password")

    res.status(200).json(
      new ApiResponse(200,{doctor},"User Updated Successfully")

    )

})

// const updatePatientAvatar = (async(req,res,next)=>{
     
// })




export {
  RegisterDoctor,
  LoginDoctor,
  LogoutDoctor,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentDoctor,
  updateCurrentDoctor
}