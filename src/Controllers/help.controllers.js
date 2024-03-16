import { ApiError } from "../Util/ApiError.utils.js";
import { ApiResponse } from "../Util/ApiResponse.utils.js";

const createHelpRequest = async (req, res, next) => {
  const { name , location , mobileNumber , description } = req.body;

  if(!name || !location || !mobileNumber || !description){
    throw new ApiError(400,"Please Provide all the required fields");
  }

  const help = await Help.create({name , location , mobileNumber , description });

  const createdHelp = await Help.findById(help._id);

  if(!createdHelp){
    throw new ApiError(500,"Something Went Wrong while creating Help Request");
  }

  res.json( new ApiResponse(201,createdHelp,"Help Request Created Successfully . We will reach you soon"));
}

const getHelpRequests = async (req, res, next) => {
  const helps = await Help.find();

  if(!helps){
    throw new ApiError(500,"Something Went Wrong while fetching Help Requests");
  }

  res.json( new ApiResponse(200,helps,"Help Requests Fetched Successfully"));
}

export { createHelpRequest, getHelpRequests };


