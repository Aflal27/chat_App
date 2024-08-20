import { ConverModel } from "../models/ConversationModel.js";

export const getConversation = async (currentUser) => {
  if (currentUser) {
    const currentUserConversation = await ConverModel.find({
      $or: [{ sender: currentUser }, { receiver: currentUser }],
    })
      .sort({ updateAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversation = currentUserConversation.map((conv) => {
      const countUnSeenMsg = conv.messages.reduce((preve, curr) => {
        const msgByUserId = curr?.msgByUserId?.toString();
        if (msgByUserId !== currentUser) {
          return preve + (curr?.seen ? 0 : 1);
        } else {
          preve;
        }
      }, 0);
      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: countUnSeenMsg,
        lastMsg: conv?.messages[conv?.messages?.length - 1],
      };
    });
    return conversation;
  } else {
    return [];
  }
};
