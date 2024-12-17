import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";

// 定義用戶的 Schema
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    male: {
      type: String,
      required: true,
      enum: ["M", "F"],
    },
    birth_data: {
      type: String,
      required: true,
    },
    Address: {
      type: String,
      required: true,
    },
    register_time: {
      type: Number,
      required: true,
    },
    last_buy_time: {
      type: Number,
      required: true,
    },
  },
  { collection: "basic" } // 直接指定 collection 為 basic
);

export async function getUserModel() {
  try {
    await dbConnect("tazze_user");
    return mongoose.models.basic || mongoose.model("basic", userSchema);
  } catch (error) {
    console.error("獲取用戶模型時出錯:", error);
    throw error;
  }
}
