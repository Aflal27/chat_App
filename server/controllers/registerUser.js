import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;
    // check email
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Alredy user exits",
        error: true,
      });
    }
    //    hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
      profile_pic,
    };
    const user = new User(payload);
    const userSave = await user.save();

    res.status(200).json({
      message: "user created successfully!",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
};
