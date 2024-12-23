import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("tazze_user");

    const { searchParams } = new URL(req.url);
    const getAllUserIds = searchParams.get("getAllUserIds");

    if (getAllUserIds) {
      try {
        const users = await db
          .collection("basic")
          .find({})
          .project({ user_id: 1 })
          .toArray();

        const userIds = users.map((user) => user.user_id);
        const sortedUserIds = userIds.sort();
        const priorityUserIds = [
          "yehxuanyow@gmail.com",
          "elizachi",
          "FB1341554725",
          "GL039001235087290920",
          "tlcplus100",
          "GL051001234569269424",
          "a06008",
          "clairedelune",
          "faroca",
          "FB100000205465363",
          "FB100001416694677",
          "katyli198433@gmail.com",
          "leonli0321@gmail.com",
          "ohnomasaya@yahoo.com.tw",
          "pettitte",
          "silvia0318",
          "suhyukju",
          "FB1341554725",
          "m16a2e4@gmail.com",
          "march30123@gmail.com",
          "GL901001235366455562",
          "bookbug",
          "galagalabom",
          "meme1172@yahoo.com.tw",
          "marvinwu1975",
          "genie037@gmail.com",
          "ilsi666@yahoo.com.tw",
          "cam1542",
          "FB1091498124325719",
          "yuyi2319@gmail.com",
          "a225811968@yahoo.com.tw",
          "FB100000125788121",
          "showmama",
          "L0932628149@gmail.com",
          "tungyuan.jin@taaze.tw",
          "ring9823@gmail.com",
          "FB2129668247335810",
          "GL854001234568537412",
          "GL844001237100516376",
          "GL132001237085573640",
          "77rinka@gmail.com",
          "GL510001237307673178",
          "FB10210641137494380",
          "tseng.chihching.tz@gmail.com",
          "b0903538217@gmail.com",
          "torozzzz1013@gmail.com",
          "b0938872292@gmail.com",
          "GL658001235313543113",
          "FB10153892982936488",
          "GL713001237740904837",
          "colawu0930@gmail.com",
          "FB100003261206982",
          "GL854001237774953851",
          "GL165001237748069431",
          "GL807001237766626287",
          "GL549001237208305526",
          "olivia01tw@gmail.com",
          "FB100001375946716",
          "crikee66@gmail.com",
          "GL738001237847389370",
          "FB1157553347592242",
          "FB1034880446643878",
          "GL101492032016015014751",
          "c0963048693@gmail.com",
        ];
        const finalUserIds = [
          ...priorityUserIds,
          ...sortedUserIds.filter((id) => !priorityUserIds.includes(id)),
        ];
        return NextResponse.json({
          success: true,
          users: finalUserIds,
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: "獲取users data失敗",
          details: error instanceof Error ? error.message : "未知錯誤",
        });
      }
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
