import { NextRequest, NextResponse } from "next/server";
import { getHistoryModel } from "@/models/History";

export async function GET(req: NextRequest) {
  try {
    const HistoryModel = await getHistoryModel();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const personaId = searchParams.get("personaId");

    if (userId && personaId) {
      const userHistory = await HistoryModel.findOne(
        { user_id: userId, persona_id: personaId },
        { messages: 1 }
      );
      if (!userHistory) {
        return NextResponse.json({
          success: true,
          userHistories: [],
        });
      }
      return NextResponse.json({
        success: true,
        userHistories: userHistory.messages,
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
        error: "獲取聊天紀錄失敗",
        details: error instanceof Error ? error.message : "未知錯誤",
      },
      { status: 500 }
    );
  }
}
