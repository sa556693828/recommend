import { NextRequest, NextResponse } from "next/server";
import { getUserModel } from "@/models/Users";
import { usersIDs } from "@/constants/userData";

export async function GET(req: NextRequest) {
  try {
    const UserModel = await getUserModel();
    const { searchParams } = new URL(req.url);
    const getAllUserIds = searchParams.get("getAllUserIds");

    if (getAllUserIds) {
      const users = await UserModel.find({}, { user_id: 1 });
      if (users.length === 0) {
        return NextResponse.json({
          success: true,
          users: usersIDs,
        });
      }
      return NextResponse.json({
        success: true,
        users: users.map((user) => user.user_id),
      });
    }

    return NextResponse.json({
      success: false,
      error: "缺少必要參數",
    });
  } catch (error: unknown) {
    console.error("API錯誤:", error);
    return NextResponse.json(
      {
        success: false,
        error: "獲取users data失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
