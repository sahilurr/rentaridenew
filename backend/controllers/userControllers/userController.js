import User from "../../models/userModel.js";
import { errorHandler } from "../../utils/error.js";
import bcryptjs from "bcryptjs";


//update user

export const updateUser = async (req, res, next) => {
  
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "you can only update your account"));
  }

  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

//delete user

export const deleteUser = async (req, res, next) => {
  if (req.user.id != req.params.id) {
    return next(errorHandler(401, "you can only delete your account"));
  }
  try {
    const userFound = await User.findByIdAndDelete(req.user.id);
    if (userFound) {
      return res.status(200).json({ message: "user deleted successfully" });
    }
    next(errorHandler(404, "user not found and not deleted"));
  } catch (error) {
    next(error);
  }
};


//signOut 

export const signOut = async(req,res,next)=> {
  try{
    // res.clearCookie('access_token','refresh_token')
    res.status(200).json({message:"signedOut successfully"})
  }
  catch(error){
   console.log(error)
   next(errorHandler(500,'error in signout controller'))
  }

}

