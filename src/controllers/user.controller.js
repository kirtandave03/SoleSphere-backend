const User = require("../models/user.model");
const Otp = require('../models/otp.model');
const apiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");
const apiResponse = require("../utils/apiResponse");
const upload = require("../middlewares/multer.middleware");
const uploadOnCloudinary = require('../utils/cloudinary')
const sendMail = require('../utils/mailer');

const generateOtp = async()=> {
   const otp =  Math.floor(1000 + Math.random() * 9000)
   return otp;
}


const userDetail = asyncHandler(async (req, res) => {
  const { email, phone, address } = req.body;

  // console.log("Request Body :",req.body);

  if ([email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if(!existedUser){
    throw new apiError(404, "User not found");
  }

  var profilePicLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.profilePic) &&
    req.files.profilePic.length > 0
  ) {
    profilePicLocalPath = req.files.profilePic[0].path;
  }

  console.log("Request Files : ", req.files);

  const profilePic = await uploadOnCloudinary(profilePicLocalPath);

  const user = await User.findByIdAndUpdate(existedUser._id,
    {
      $set: {
        phone,
        address,
        profilePic: profilePic.url || "",
      }

    });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user");
  }

  res
    .status(201)
    .json(new apiResponse(200, createdUser, "User Created Sucessfully"));
});

const signupUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;

  if ([username, email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new apiError(409, "User with username or email already exist");
  }

  const otp = await generateOtp();
  const cDate = new Date()
  await Otp.findOneAndUpdate(
    {email},
    {otp : otp, isVerified: false, timestamp: new Date(cDate.getTime())},
    {new : true, upsert : true, setDefaultsOnInsert: true}
  )

  const content = `<p>Hello , ${username} <br> <b> ${otp} </b>is your one time verification(OTP) for your SoleSphere Account, valid for 90 seconds.
  Please do not share with others.`

  sendMail(email, 'Login otp', content)
  res
    .status(201)
    .json(new apiResponse(200, {user : {username, email}}, "User Created Sucessfully"));
})

const verifyOtp = asyncHandler(async(req, res)=>{

  const { username, email, password, otp} = req.body;
  
  if ([username, email, password, otp].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const otpData = await Otp.findOne({email,otp});

  if(!otpData){
    throw new apiError(400,"Incorrect OTP!");
  }

  const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
    });
  
    const createdUser = await User.findById(user._id).select("-password");
  
    if (!createdUser) {
      throw new apiError(500, "Something went wrong while registering the user");
    }
  
    res
      .status(201)
      .json(new apiResponse(200, createdUser, "User Created Sucessfully"));
  })

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("password : ", password)
  if (!email || !password) {
    throw new apiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(400, "User not exist");
  }

  const isPassValid = await user.isPasswordCorrect(password);
  console.log(isPassValid);

  if (!isPassValid) {
    throw new apiError(400, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  return res.status(200).json(
    new apiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      "Login successfully!"
    )
  );
});

module.exports = { signupUser, loginUser, userDetail,verifyOtp };
