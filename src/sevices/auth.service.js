const User = require("../models/user.model");
const apiError = require("../interfaces/apiError");
const apiResponse = require("../interfaces/apiResponse");
const sendMail = require("../sevices/mailer");
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
}

module.exports = AuthService;
