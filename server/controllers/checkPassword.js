import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const checkPassword = async (req, res) => {
  try {
    const { password, userId } = req.body;
    console.log(password, userId);

    const user = await User.findById(userId);

    const verifyPassword = await bcryptjs.compare(password, user.password);

    if (!verifyPassword) {
      return res.status(400).json({
        message: "Please check password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECREAT_KEY, {
      expiresIn: "1d",
    });

    const cookieOptions = {
      http: true,
      secure: true,
    };

    return res.cookie("token", token, cookieOptions).status(200).json({
      message: "Login successfully",
      token: token,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
