import express from "express";

import { admin } from "../controllers/adminController.js";

const adminRout = express.Router();

const { adminLogin, getUsers, manageUserStatus, editUser, deleteUser, addEvent } = admin

adminRout.post("/login", adminLogin);
adminRout.post("/addevent", addEvent);
adminRout.get("/getusers", getUsers);
adminRout.patch("/userstatus", manageUserStatus);
adminRout.patch("/edituser", editUser);
adminRout.patch("/deleteuser", deleteUser);

export default adminRout;
