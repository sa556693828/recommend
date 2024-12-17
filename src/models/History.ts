import mongoose from "mongoose";
import { Message, UserHistory, BookData } from "@/types";
import dbConnect from "@/lib/mongodb";
const BookDataSchema = new mongoose.Schema<BookData>({
  book_id: {
    type: String,
    required: true,
  },
  book_title: {
    type: String,
    required: true,
  },
  book_url: {
    type: String,
    required: true,
  },
  book_image: {
    type: String,
    required: false,
  },
});

const messageSchema = new mongoose.Schema<Message>({
  role: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  book_list: {
    type: [BookDataSchema],
    default: [],
  },
  prompts: {
    type: [String],
    default: [],
  },
});
const historySchema = new mongoose.Schema<UserHistory>(
  {
    user_id: {
      type: String,
      required: true,
    },
    persona_id: {
      type: String,
      required: true,
    },
    messages: {
      type: [messageSchema],
      required: true,
    },
  },
  {
    collection: "User_History",
    timestamps: true,
  }
);
export async function getHistoryModel() {
  try {
    await dbConnect("MarketingAgent");
    return (
      mongoose.models.User_History ||
      mongoose.model("User_History", historySchema)
    );
  } catch (error) {
    console.error("獲取歷史紀錄時出錯:", error);
    throw error;
  }
}