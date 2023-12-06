import Admin from "../models/admin.js";
import Event from "../models/event.js";
import User from "../models/user.js";

export const admin = {
    // admin login
  adminLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (admin) {
        const isMatch = await admin.comparePassword(password);
        if (isMatch) {
          admin.password = undefined;
          const token = await admin.creatJwt();
          res.status(200).send({
            success: true,
            message: "Login Success",
            admin,
            token,
          });
        } else {
          res.status(403).send({
            success: false,
            message: "Invalid Password",
          });
        }
      } else {
        res.status(403).send({
          success: false,
          message: "Invalid Admin",
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

  // user management
  getUsers: async (req, res) => {
    try {
      const users = await User.find({is_deleted:false});
      if (users.length) {
        res.status(200).send({
          success: true,
          users,
        });
      } else {
        res.status(404).send({
          success: false,
          message: "Users Not found",
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
  },
  // user block unblock
  manageUserStatus: async (req, res) => {
    try {
      const userId = await User.findById(req.body.id);
      if (userId) {
        if (userId.is_blocked) {
          await User.updateOne(
            { _id: userId },
            { $set: { is_blocked: false } }
          ).then(() => {
            res.status(201).send({
              success: true,
              message: "User Unblocked",
            });
          });
        } else {
          await User.updateOne(
            { _id: userId },
            { $set: { is_blocked: true } }
          ).then(() => {
            res.status(201).send({
              success: true,
              message: "User Blocked",
            });
          });
        }
      } else {
        res.status(404).send({
          success: false,
          message: "User not found",
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
  },
  // edit user
  editUser: async(req,res)=>{
    try {
        const {userId,editName } = req.body
        await User.updateOne({_id:userId}, {$set:{
            name:editName
        }})
        res.status(201).send({
            success:true,
            message:"User Name Edited Success"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Server Error",
          error,
        });
    }
  },

  deleteUser: async(req,res)=>{
    try {
        const {userId} = req.body
        await User.updateOne(
            { _id: userId },
            { $set: { is_deleted: true } })
            res.status(201).send({
                success:true,
                message:"User Deleted Success"
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Server Error",
          error,
        });
    }
  },

// Add event
addEvent: async(req,res)=>{
    try {
        const { eventName, eventDateTime, eventUrl} = req.body
        const event = await Event.findOne({eventName})
        if(event){
            return res.status(400).send({
                success: false,
                message: "Event Name Already Exist",
              });
        }else{

            const event = await Event.create({ eventName, eventDateTime, eventUrl });
            if(event){
                res.status(200).send({
                    success:true,
                    message:"Event Added Success"
                })
            }else{
                res.status(404).send({
                    success:false,
                    message:"Something went wrong"
                })
            }
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
