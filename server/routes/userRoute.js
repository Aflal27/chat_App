import express from "express";
import { register } from "../controllers/registerUser.js";
import { checkEmail } from "../controllers/checkEmail.js";
import { checkPassword } from "../controllers/checkPassword.js";
import { logout } from "../controllers/logout.js";
import { updateUser } from "../controllers/updateUser.js";
import { userDetails } from "../controllers/userDetails.js";
import { searchUser } from "../controllers/searchUser.js";

const router = express.Router();
router.post("/register", register);
router.post("/checkEmail", checkEmail);
router.post("/checkPassword", checkPassword);
router.get("/user-details", userDetails);
router.get("/logout", logout);
router.post("/update", updateUser);
router.post("/search", searchUser);

export default router;
