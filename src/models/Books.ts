import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    book_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    book_id_store: {
      type: Number,
      required: true,
    },
    book_title: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    shipping_id: {
      type: Number,
      required: true,
    },
    EAN: {
      type: String,
      required: true,
    },
    publish_id: {
      type: String,
      required: true,
    },
    publish_time: {
      type: String,
      required: true,
    },
    list_price: {
      type: Number,
      required: true,
    },
    sale_price: {
      type: Number,
      required: true,
    },
    special_price: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "books_data",
    timestamps: true,
  }
);

// 防止重複定義 model
const Books =
  mongoose.models.books_data || mongoose.model("books_data", bookSchema);

export default Books;
