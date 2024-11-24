import mongoose from "mongoose";

// 定義用戶的 Schema
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      unique: true,
      index: true, // 添加索引以提高查詢效率
    },
    male: {
      type: String,
      required: true,
      enum: ["M", "F"], // 限制性別只能是 M 或 F
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
  { collection: "basic" }
);

// 防止重複定義 model
const Users = mongoose.models.basic || mongoose.model("basic", userSchema);

export default Users;
