import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const getToken = async (token) => {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }
  const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);
  const user = await User.findById(decode.id).select("-password");
  return user;
};
