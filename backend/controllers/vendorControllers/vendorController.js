import User from "../../models/userModel.js";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { errorHandler } from "../../utils/error.js";


const expireDate = new Date(Date.now() + 3600000);

export const vendorSignup = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const hadshedPassword = bcryptjs.hashSync(password, 10);
    const user = await User.create({
      username,
      password: hadshedPassword,
      email,
      isVendor: true,
    });
    await user.save();
    res.status(200).json({ message: "vendor created successfully" });
  } catch (error) {
    next(error);
  }
};

export const vendorSignin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validVendor = await User.findOne({ email }).lean();
    if (!validVendor || !validVendor.isVendor) {
      return next(errorHandler(404,"user not found"))
    }
    const validPassword = bcryptjs.compareSync(password, validVendor.password);
    if (!validPassword) {
      return next(errorHandler(404,"wrong credentials"));
    }
   
    const token = Jwt.sign({ id: validVendor._id }, process.env.ACCESS_TOKEN);
    const { password: hadshedPassword, ...rest } = validVendor;
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: thirtyDaysInMilliseconds,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const vendorSignout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "vendor signedout successfully" });
  } catch (error) {
    next(error);
  }
};


//vendor login or signup with google

export const vendorGoogle = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).lean();
    if (user && user.isVendor) {
      const { password: hashedPassword, ...rest } = user;
      const token = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); //we are generating a random password since there is no password in result
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        profilePicture: req.body.photo,
        password: hashedPassword,
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        isVendor:true,
        //we cannot set username to req.body.name because other user may also have same name so we generate a random value and concat it to name
        //36 in toString(36) means random value from 0-9 and a-z
      });
      try{
        const savedUser=  await newUser.save();
     const userObject = savedUser.toObject();
     
      const token = Jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN);
      const { password: hashedPassword2, ...rest } = userObject;
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expireDate,
        })
        .status(200)
        .json(rest);
      }
      catch(error){
        if(error.code === 11000){
          return next(errorHandler(409,"email already in use"))
        }
        next(error)
      }
     
    }
  } catch (error) {
    next(error);
  }
};
