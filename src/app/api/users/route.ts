import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("MarketingAgent");

    const { searchParams } = new URL(req.url);
    const getAllUserIds = searchParams.get("getAllUserIds");

    if (getAllUserIds) {
      try {
        const users = await db
          .collection("User_Graph")
          .find({})
          .project({ "layer_1_data.cust_id": 1 })
          .toArray();

        const custIds = users
          .map((user) => user.layer_1_data?.cust_id)
          .filter(Boolean);

        const sortedUserIds = custIds.sort();
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
          "cam1542@yahoo.com.tw",
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
          "a0921012252@gmail.com",
          "yuio0408@gmail.com",
          "77rinka@gmail.com",
          "davidrosas.xc@gmail.com",
          "jeremy.liang@msa.hinet.net",
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
          "jinnibo@gmail.com",
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
