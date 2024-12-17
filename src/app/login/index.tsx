/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useCallback, useEffect, useState } from "react";

interface Books {
  book_id: string;
  book_title: string;
  book_url: string;
}
interface UserHistory {
  role: string;
  content: string;
}

const Login = () => {
  const [userId, setUserId] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // async function getAllUserIds(): Promise<string[]> {
  //   try {
  //     const response = await fetch("/api/users?getAllUserIds=true", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       console.error("API返回錯誤:", data); // 添加更多錯誤信息
  //       throw new Error(data.error || data.details || "獲取用戶ID失敗");
  //     }

  //     console.log("獲取到的用戶數據:", data); // 添加成功日誌
  //     return data.users;
  //   } catch (error: any) {
  //     console.error("獲取用戶ID時發生錯誤:", {
  //       message: error.message,
  //       stack: error.stack,
  //       name: error.name,
  //     });
  //     throw error;
  //   }
  // }

  // // 修改 useEffect 的錯誤處理
  // useEffect(() => {
  //   getAllUserIds()
  //     .then((userIds) => {
  //       console.log("設置用戶ID列表:", userIds);
  //       setUserIds(userIds);
  //     })
  //     .catch((error) => {
  //       console.error("設置用戶ID失敗:", error);
  //     });
  // }, []);
  const handleUserSelect = (selectedId: string) => {
    setUserId(selectedId);
    setIsUserListOpen(false);
  };
  const filteredUserIds = userIds.filter((id) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div
      className="flex justify-center w-full gap-2 p-2 bg-[#e8e8e8]"
      style={{
        minHeight: "calc(100vh - 60px)",
      }}
    >
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">用戶登入</h1>

        {/* 用戶選擇區域 */}
        <div className="w-full mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={() => setIsUserListOpen(true)}
              placeholder="搜尋或選擇用戶ID"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {isUserListOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredUserIds.map((id) => (
                  <div
                    key={id}
                    onClick={() => handleUserSelect(id)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    {id}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 登入按鈕 */}
        <button
          onClick={() => {
            if (userId) {
              // 這裡可以添加登入邏輯
              console.log("登入用戶:", userId);
            }
          }}
          disabled={!userId}
          className={`w-full py-2 text-white rounded-lg ${
            userId
              ? "bg-blue-500 hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          登入
        </button>
      </div>
    </div>
  );
};

export default Login;
