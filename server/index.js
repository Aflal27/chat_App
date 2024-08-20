import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
// routers
import userRoute from "./routes/userRoute.js";
// socket
import { server } from "./socket/index.js";
import { app } from "./socket/index.js";
import path from "path";


// const app = express();
app.use(
  cors({
    origin: process.env.FRONTENDURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "hello",
  });
});

// build
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});



// craete db
mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("db connected!");
  })
  .catch((error) => {
    console.log("DB ERROR :", error);
  });

// routers
app.use("/api/user", userRoute);

server.listen(8000, () => {
  console.log("server is running!");
});
