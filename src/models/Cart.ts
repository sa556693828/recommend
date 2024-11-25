import mongoose from "mongoose";

// 定義訂單的 Schema
const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true, // 添加索引以提高查詢效率
    },
    book_id: {
      type: Number,
      required: true,
    },
    update_time: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "user_shoppingCart",
    timestamps: true, // 添加 createdAt 和 updatedAt 字段
  }
);

// 防止重複定義 model
const Cart =
  mongoose.models.user_shoppingCart ||
  mongoose.model("user_shoppingCart", cartSchema);

export default Cart;
