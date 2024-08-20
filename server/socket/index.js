import express from "express";
import { Server } from "socket.io";
import http from "http";
import { getToken } from "../helpers/getUserDetailsFromToken.js";
import User from "../models/userModel.js";
import { ConverModel, MessageModel } from "../models/ConversationModel.js";
import { getConversation } from "../helpers/getConversation.js";

export const app = express();
// socket connection
export const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTENDURL,
    credentials: true,
  },
});
const onlineUser = new Set();
io.on("connection", async (socket) => {
  console.log("connect user", socket.id);
  const token = socket.handshake.auth.token;
  // current user details
  const user = await getToken(token);

  //create room
  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("messagePage", async (userId) => {
    console.log("userId", userId);
    const userData = await User.findById(userId);

    const payload = {
      _id: userData?._id,
      name: userData?.name,
      email: userData?.email,
      profile_pic: userData?.profile_pic,
      online: onlineUser.has(userId),
    };

    socket.emit("messageUser", payload);

    // get previous message
    const getConversationMessage = await ConverModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updateAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // new message
  socket.on("newMessage", async (data) => {
    console.log("newMessage", data);

    let conversation = await ConverModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    //if conversation is not available
    if (!conversation) {
      const createConversation = await ConverModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    const updateConver = await ConverModel.updateOne(
      { _id: conversation?._id },
      {
        $push: { messages: saveMessage?._id },
      }
    );
    const getConversationMessage = await ConverModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updateAt: -1 });
    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );
    // send conversation
    const conversationSender = await getConversation(data?.sender);
    const conversationReceiver = await getConversation(data?.receiver);
    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);
  });

  // sidebar
  socket.on("sidebar", async (currentUser) => {
    console.log("currentUser", currentUser);
    const conversation = await getConversation(currentUser);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await ConverModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });
    const conversationMessageId = conversation?.messages || [];
    const updateMessage = await MessageModel.updateMany(
      { _id: { $in: conversationMessageId }, msgByUserId: msgByUserId },
      { $set: { seen: true } }
    );
    const conversationSender = await getConversation(user?._id);
    const conversationReceiver = await getConversation(msgByUserId);
    io.to(user?._id.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });

  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("disconnect user", socket.id);
  });
});
