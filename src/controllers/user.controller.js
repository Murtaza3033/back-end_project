import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { apiResponse } from "../utils/apiResponse.js"


const registerUser=asyncHandler(async(req,res)=>{
    //  res.status(200).json({
    //     message:"ok"
    // })
    //get user details from frontend
    //validation email pass-not empty 
    //Check if user already exist,username email
    //check for images, then avatar
    //upload them to cloudinary,avatar
    //create user object - create entry in db
    //remove pass and refresh token field from response
    //check for user creation 
    //return response if not send error

   const {fullName, email, username, password}= req.body
//    console.log("email,",email);

//    if(fullName === ""){
//     throw new apiError(400,"fullname is required")
//    }
    if(
        [fullName, email, username, password].some((field)=>
        field?.trim() === "")
    ){
        throw new apiError(400,"All fields are required")
    }
    //check if user already exist
    
    const existedUser= await User.findOne({
        $or:[{ email }, { username }]
    })
    if(existedUser){
        throw new apiError(409,"User with email or username already exist")
    }
    //console.log(req.files);

    const avatarLocalPath=req.files?.avatar[0]?.path; 

    // const coverImageLocalPath=req.files?.coverImage[0]?.path; 

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath=req.files.coverImage[0]?.path;
    }

    if(!avatarLocalPath){
        throw new apiError(400,"Avatar file is required")
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new apiError(400,"Avatar file is required")
    }

    const user= await User.create({
        fullName,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        username:username.toLowerCase(),
        password
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new apiError(500,"Something went wrong while registering a user")
    }

    return res.status(201).json(
        new apiResponse(200,createdUser,
            "User registered successfully"
        )
    )
})

export {registerUser}