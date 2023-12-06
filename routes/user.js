import express from "express";

import { user } from "../controllers/userController.js";

const { verifyEmailOtp, userRegister, userLogin, getEvents } = user;

const userRout = express.Router();

userRout.post("/register", userRegister);
userRout.post("/verify", verifyEmailOtp);
userRout.post("/login", userLogin);
userRout.get("/events", getEvents);

export default userRout;
