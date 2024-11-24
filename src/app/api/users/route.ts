import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Users from "@/models/Users";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const getAllUserIds = searchParams.get("getAllUserIds");

    if (getAllUserIds === "true") {
      // 只獲取 user_id 欄位
      console.log("getAllUserIds");
      const users = await Users.find({});
      return NextResponse.json({
        success: true,
        users: users.map((user) => user.user_id),
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "獲取用戶資料失敗：" + error,
    });
  }
}
