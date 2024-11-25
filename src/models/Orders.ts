import mongoose from "mongoose";

// 定義訂單的 Schema
const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      index: true, // 添加索引以提高查詢效率
    },
    order_id: {
      type: Number,
      required: true,
      unique: true,
    },
    book_id: {
      type: Number,
      required: true,
    },
    book_price: {
      type: Number,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
    eCoupon_id: {
      type: String,
      required: false, // 優惠券可能為空
    },
    pickup_address: {
      type: String,
      required: true,
    },
    pickup_store: {
      type: Number,
      required: true,
    },
    pickup_store_id: {
      type: Number,
      required: true,
    },
    pickup_store_name: {
      type: String,
      required: true,
    },
    created_time: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "user_order",
    timestamps: true, // 添加 createdAt 和 updatedAt 字段
  }
);

// 防止重複定義 model
const Orders =
  mongoose.models.user_order || mongoose.model("user_order", orderSchema);

export default Orders;
