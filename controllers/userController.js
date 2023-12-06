import crypto from "crypto";
import moment from "moment";
//imports files
import User from "../models/user.js";
import { genPass } from "../config/bcript.js";
import { configEmail } from "../config/emailConfig.js";
import Event from "../models/event.js";

const { sendEmailOtp } = configEmail;

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
export const user = {
  //user registration
  userRegister: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({
          success: false,
          message: "Email Already Exist Please Login",
        });
      } else {
        const otp = generateOTP();
        const userData = await User.create({ name, email, password, otp });
        if (userData) {
          sendEmailOtp(name, email, otp);
          res.status(201).send({
            success: true,
            message: "Check Your Email and Enter OTP",
            user: {
              name: userData.name,
              email: userData.email,
            },
          });
        } else {
          res.status(400).send({
            success: false,
            message: "Something wend wrong",
            error,
          });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error Registration",
        error,
      });
    }
  },
  // verify email otp
  verifyEmailOtp: async (req, res) => {
    try {
      const { enteredOtp } = req.body;
      const user = await User.findOne({ otp: enteredOtp });
      if (user) {
        await User.findOneAndUpdate({ _id: user._id }, { $unset: { otp: 1 } });
        user.password = undefined;
        const token = await user.creatJwt();
        res.status(200).send({
          success: true,
          message: "OTP Verified successfully.",
          user,
          token,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Invalid OTP. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error verifying OTP.",
        error,
      });
    }
  },
  // user Login
  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select("+Password");
      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          if (user.is_deleted) {
            res.status(403).send({
              success: false,
              message: "Youre account is Deleted",
            });
          } else {
            if (user.is_blocked) {
              res.status(403).send({
                success: false,
                message: "Youre account is blocked",
              });
            } else {
              user.password = undefined;
              const token = await user.creatJwt();
              res.status(200).send({
                success: true,
                message: "Login Success",
                user,
                token,
              });
            }
          }
        } else {
          res.status(403).send({
            success: false,
            message: "Invalid Password",
          });
        }
      } else {
        res.status(403).send({
          success: false,
          message: "Invalid Email",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error Login",
        error,
      });
    }
  },

  getEvents: async(req,res)=>{
    try {
      const event = await Event.find()
      if(event){
        res.status(200).send({
          success: true,
          event
      });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Server Error",
        error,
      });
    }
  }
  
};
