import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Orders from "@/models/Orders";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "缺少 user_id 參數",
        },
        { status: 400 }
      );
    }

    // 根據 user_id 查詢訂單
    const orders = await Orders.find({ user_id: userId })
      .sort({ created_time: -1 }) // 按創建時間降序排序
      .lean(); // 轉換為純 JavaScript 對象，提高性能

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("獲取訂單時發生錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取訂單失敗：" + error,
      },
      { status: 500 }
    );
  }
}
