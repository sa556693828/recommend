import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Books from "@/models/Books";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const book_id = searchParams.get("book_id");

    if (!book_id) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少 book_id 參數",
        },
        { status: 400 }
      );
    }

    // 根據 book_id 查詢書籍
    const books = await Books.find({ book_id: book_id })
      .sort({ created_time: -1 }) // 按創建時間降序排序
      .lean(); // 轉換為純 JavaScript 對象，提高性能

    return NextResponse.json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("獲取書籍時發生錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取書籍失敗：" + error,
      },
      { status: 500 }
    );
  }
}
