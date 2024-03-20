const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const sendMail = require("../services/mailer");
const { z } = require("zod");
const Otp = require("../models/otp.model");
const Admin = require("../models/admin.model");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());

const signupUserValidator = z.object({
  username: z
    .string()
    .min(4)
    .max(32)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\s]{4,25}$/),
  email: z.string().email(),
});

const generateOtp = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};

class AuthService {
  constructor() {}

  createUser = async (req, res) => {
    const { UID, email, username } = req.body;

    if ([username, email, UID].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
      // throw new apiError(409, "User with email already exist");
      return res.status(409).json({ message: "User exists" });
    }

    const user = await User.create({
      UID,
      username,
      email,
    });

    if (!user) {
      throw new apiError(500, "Error while registering user");
    }

    // const accessToken = user.generateAccessToken();

    return res
      .status(201)
      .json(new apiResponse({ user }, "User Created successfully"));
  };

  signupUser = async (req, res) => {
    const { username, email, password } = signupUserValidator.parse(req.body);

    if ([username, email].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new apiError(409, "User with email already exist");
    }
  };

  verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if ([email, otp].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const otpData = await Otp.findOne({
      email,
      otp,
    });

    console.log(otpData);
    if (!otpData) {
      throw new apiError(400, "Incorrect Otp");
    }

    const admin = await Admin.findOne({ email }).select("-password");

    const accessToken = admin.generateAccessToken();
    console.log(accessToken);

    const deleted = await Otp.deleteOne({ email });

    const options = {
      httpOnly: true,
      secure: false,
    };

    console.log(deleted, email);
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new apiResponse(
          { admin, accessToken },
          "Admin verified Sucessfully & Login successful"
        )
      );
  };

  loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("password : ", password);
    if (!email || !password) {
      throw new apiError(400, "Email and password are required");
    }

    const user = await Admin.findOne({ email });

    if (!user) {
      throw new apiError(404, "Admin not exist");
    }

    const isPassValid = await user.isPasswordCorrect(password);
    console.log(isPassValid);

    if (!isPassValid) {
      throw new apiError(401, "Invalid credentials");
    }

    const otp = await generateOtp();

    const currentDate = new Date();
    await Otp.findOneAndUpdate(
      { email },
      {
        otp: otp,
        isVerified: false,
        timestamp: new Date(currentDate.getTime()),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const content = `<p>Hello , Admin <br> <b> ${otp} </b>is your one time verification(OTP) for your SoleSphere Account, valid for 90 seconds.
    Please do not share with others.`;

    sendMail(email, "Login otp", content);

    return res
      .status(201)
      .json(
        new apiResponse({ Admin: { email } }, "Otp has been sent successfully!")
      );
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
      throw new apiError(400, "email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new apiError(404, "User not found");
    }

    const otp = await generateOtp();
    const currentDate = new Date();
    await Otp.findOneAndUpdate(
      { email },
      {
        otp: otp,
        isVerified: false,
        timestamp: new Date(currentDate.getTime()),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    const content = `<p>Dear ${user.username}, <br><br>
    You've requested to reset your password. Please use the OTP code below to proceed:
    <br><br>OTP Code: <b>${otp}</b><br><br>
    This OTP is valid for the next 90 seconds. If you haven't requested this password reset, please ignore this message.<br><br>
    Thank you,<br>SoleSphere Team`;

    // Subject: Password Reset OTP
    sendMail(email, "Password Reset OTP", content);

    res
      .status(200)
      .json(new apiResponse(email, "Otp has been sent successfully!"));
  };

  forgotPasswordotp = async (req, res) => {
    const { email, otp } = req.body;

    if ([email, otp].some((field) => field?.trim() === "")) {
      throw new apiError(400, "email and otp are required");
    }

    const otpData = await Otp.findOne({
      email,
      otp,
    });

    console.log(otpData);
    if (!otpData) {
      throw new apiError(400, "Incorrect Otp");
    }

    const otpResponse = await Otp.findOneAndUpdate(
      { email },
      {
        isVerified: true,
      },
      { new: true }
    );

    res
      .status(200)
      .json(
        new apiResponse(
          { isVerified: otpResponse.isVerified },
          "User verified Sucessfully"
        )
      );
  };

  changePassword = async (req, res) => {
    const { email, isVerified, password, confirmPassword } = req.body;

    // if (
    //   [email, isVerified, password, confirmPassword].some(
    //     (field) => field?.trim() === ""
    //   )
    // ) {
    //   throw new apiError(400, "email and otp are required");
    // }

    if (password !== confirmPassword) {
      throw new apiError(400, "Password and confirm password are not same");
    }

    const user = await User.findOne({ email });

    if (!isVerified) {
      throw new apiError(401, "Unauthorized to change password");
    }

    user.password = password;
    await user.save({ validateBeforeSave: true });

    const deleted = await Otp.deleteOne({ email });
    console.log(deleted, email);

    res.status(200).json(new apiResponse(user, "password changed Sucessfully"));
  };
}

module.exports = AuthService;
