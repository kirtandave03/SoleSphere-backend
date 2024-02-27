const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const sendMail = require("../services/mailer");
const { z } = require("zod");
const Otp = require("../models/otp.model");

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
      throw new apiError(409, "User with email already exist");
    }

    const user = await User.create({
      UID,
      username,
      email,
    });

    if (!user) {
      throw new apiError(500, "Error while registering user");
    }

    const accessToken = user.generateAccessToken();

    return res
      .status(201)
      .json(
        new apiResponse({ user, accessToken }, "User Created successfully")
      );
  };

  signupUser = async (req, res) => {
    const { username, email } = signupUserValidator.parse(req.body);

    if ([username, email].some((field) => field?.trim() === "")) {
      throw new apiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new apiError(409, "User with email already exist");
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

    const content = `<p>Hello , ${username} <br> <b> ${otp} </b>is your one time verification(OTP) for your SoleSphere Account, valid for 90 seconds.
    Please do not share with others.`;

    sendMail(email, "Login otp", content);

    return res
      .status(201)
      .json(
        new apiResponse(
          { user: { username, email } },
          "Otp has been sent successfully!"
        )
      );
  };

  verifyOtp = async (req, res) => {
    const { username, email, password, otp } = req.body;

    if (
      [username, email, password, otp].some((field) => field?.trim() === "")
    ) {
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

    const user = await User.create({
      username: username.toLowerCase(),
      email,
      password,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
      throw new apiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    const accessToken = user.generateAccessToken();

    const deleted = await Otp.deleteOne({ email });

    console.log(deleted, email);
    res
      .status(201)
      .json(
        new apiResponse(
          { createdUser, accessToken },
          "User Created Sucessfully"
        )
      );
  };

  loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log("password : ", password);
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
      throw new apiError(401, "Invalid credentials");
    }

    const accessToken = user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    return res.status(200).json(
      new apiResponse(
        {
          user: loggedInUser,
          accessToken,
        },
        "Login successfully!"
      )
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
