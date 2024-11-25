"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

interface RecommendationResponse {
  advice: string;
  books: {
    book_id: string;
    book_title: string;
    book_url: string;
    reason: string;
  }[];
}
interface KeyObject {
  name: string;
  w: number;
}

interface CartItem {
  book_id: string;
  book_title: string;
  price: number;
  quantity: number;
}

interface OrderItem {
  order_id: string;
  book_id: string;
  book_title: string;
  price: number;
  order_date: string;
  status: string;
}

//TODO:交易數據、收藏、分析，寫了一個癮琴去分析他的東西，
//TODO:從歷史數據or等等分析他的行為
//TODO:趨勢的prompting，編輯推薦的書（上傳買斷的書
//TODO:暢銷排行榜
//TODO:比例
interface FileState {
  bestseller?: File;
  buyoff?: File;
  trending?: File;
}

const BookRecommendation = () => {
  const [userId, setUserId] = useState("");
  const [userIds, setUserIds] = useState<string[]>([]);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [advice, setAdvice] = useState<string>("");
  const [books, setBooks] = useState<RecommendationResponse["books"]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileState>({});
  const [userCart, setUserCart] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any>(null);

  const keyConfig: { [key: string]: KeyObject } = {
    id: { name: "編號", w: 0 },
    user_id: { name: "ID", w: 100 },
    order_id: { name: "訂單ID", w: 100 },
    book_id: { name: "書籍ID", w: 100 },
    book_price: { name: "價格", w: 100 },
    Amount: { name: "數量", w: 100 },
    created_time: { name: "訂單日期", w: 100 },
    update_time: { name: "更新時間", w: 100 },
    book_title: { name: "書名", w: 100 },
  };
  const orderKeyArray = [
    "user_id",
    "order_id",
    "book_title",
    "book_id",
    "book_price",
    "Amount",
    "created_time",
  ];
  const cartKeyArray = ["user_id", "book_id", "update_time"];

  const orderColumns: TableProps<any>["columns"] = orderKeyArray.map((key) => {
    return {
      title: keyConfig[key].name,
      dataIndex: key,
      key: key,
      ellipsis: true,
      width: keyConfig[key].w,
      className: "text-base",
      render: (text, record) => {
        if (key === "book_title") {
          const bookName = getBookName(record.book_id);
          return bookName;
        }
        return text ? text : "-";
      },
    };
  });

  const cartColumns: TableProps<any>["columns"] = cartKeyArray.map((key) => {
    return {
      title: keyConfig[key].name,
      dataIndex: key,
      key: key,
    };
  });

  const getBookName = async (book_id: string) => {
    try {
      const response = await fetch(`/api/books_data?book_id=${book_id}`);
      const data = await response.json();
      if (data.success) {
        return data.books[0].book_title;
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
  };
  const handleFileChange =
    (fileType: keyof FileState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setUploadedFiles((prev) => ({
          ...prev,
          [fileType]: file,
        }));
      }
    };
  const handleFileDelete = (fileType: keyof FileState) => () => {
    setUploadedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileType];
      return newFiles;
    });
  };

  const PROMPT_SUGGESTIONS = [
    { id: 1, text: "經驗見解的書籍，幫助拓展用戶的視野。" },
    {
      id: 2,
      text: "推薦能挑戰用戶平常閱讀喜好的書籍，引入新類型或非傳統的敘事方式。",
    },
    {
      id: 3,
      text: "推薦深入探討複雜理念、理論或哲學的書籍，鼓勵用戶進行深度思考與反省。",
    },
    {
      id: 4,
      text: "推薦能深入描繪情感波折或角色成長的書籍，特別適合正在經歷分手的用戶。",
    },
    {
      id: 5,
      text: "推薦探討台灣是否應向美國支付保護費這一有爭議議題的書籍，提升用戶對此問題的認識與思考。",
    },
    {
      id: 6,
      text: "推薦能在用戶特定關注領域中激發自我提升、正念或個人轉變的書籍。",
    },
  ];

  const handlePromptSelect = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  async function getAllUserIds(): Promise<string[]> {
    try {
      const response = await fetch("/api/users?getAllUserIds=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "獲取用戶ID失敗");
      }

      return data.users;
    } catch (error) {
      console.error("獲取用戶ID時發生錯誤:", error);
      throw error;
    }
  }
  useEffect(() => {
    getAllUserIds().then((userIds) => setUserIds(userIds));
  }, []);

  const getUserCartAndOrders = async (userId: string) => {
    try {
      const cart = await fetch(`/api/user_shoppingCart?user_id=${userId}`);
      const orders = await fetch(`/api/user_orders?user_id=${userId}`);
      if (!cart.ok || !orders.ok) {
        throw new Error("請求失敗");
      }
      const cartData = await cart.json();
      const ordersData = await orders.json();
      setUserCart(cartData);
      setUserOrders(ordersData);
    } catch (error) {
      console.error("獲取用戶購物車和訂單時發生錯誤:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const env = process.env.NODE_ENV;
    const baseUrl =
      env === "development"
        ? "http://54.238.1.161:9000"
        : `${process.env.NEXT_PUBLIC_NGROK_URL}`;
    try {
      const formData = new FormData();

      if (uploadedFiles) {
        Object.entries(uploadedFiles).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);
          }
        });
      }
      getUserCartAndOrders(userId);
      formData.append("user", userId);
      if (prompt) {
        formData.append("prompt", prompt);
      }
      const response = await fetch(`${baseUrl}/recommend`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`請求失敗: ${response.status}`);
      }

      const data: RecommendationResponse = await response.json();
      console.log(data);
      setAdvice(data.advice);
      setBooks(data.books);
    } catch (error) {
      console.error("發送請求時發生錯誤:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (selectedId: string) => {
    setUserId(selectedId);
    setIsUserListOpen(false);
  };
  const filteredUserIds = userIds.filter((id) =>
    id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-[#F8F3E6]">
      <div className="max-w-4xl mx-auto p-6">
        {/* 輸入表單區域 */}
        <div className="bg-[#FDF9F0] rounded-lg shadow-sm border border-[#E8DFC9] p-6 mb-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2 relative">
              {/* 用戶 ID 輸入和選擇區域 */}
              <div className="relative">
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  onClick={() => setIsUserListOpen(true)}
                  placeholder="請輸入或選擇用戶 ID"
                  className="w-full px-4 py-2 text-black rounded-md border border-[#E8DFC9] focus:outline-none focus:ring-2 focus:ring-[#89B9DB]/20 focus:border-[#89B9DB] bg-white"
                />
                <button
                  type="button"
                  onClick={() => setIsUserListOpen(!isUserListOpen)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#89B9DB]"
                >
                  ▼
                </button>
              </div>

              {/* 用戶 ID 列表彈出框 */}
              {isUserListOpen && (
                <div className="absolute text-black z-10 w-full mt-1 bg-white border border-[#E8DFC9] rounded-md shadow-lg">
                  <div className="p-2 border-b border-[#E8DFC9]">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="搜尋用戶 ID..."
                      className="w-full px-3 py-1 border border-[#E8DFC9] rounded-md focus:outline-none focus:ring-1 focus:ring-[#89B9DB]"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredUserIds.map((id, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleUserSelect(id)}
                        className="w-full px-4 py-2 text-left hover:bg-[#F8F3E6] focus:bg-[#F8F3E6] focus:outline-none"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={handlePromptChange}
                  placeholder="增強 prompt（選填）"
                  className="flex-1 px-4 py-2 rounded-md border text-black border-[#E8DFC9] focus:outline-none focus:ring-2 focus:ring-[#89B9DB]/20 focus:border-[#89B9DB] bg-white"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handlePromptSelect(suggestion.text)}
                    className="px-3 py-1.5 text-sm bg-white hover:bg-[#F8F3E6] text-[#6B7C8C] rounded-md border border-[#E8DFC9] transition-colors duration-200"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {!uploadedFiles.bestseller ? (
                    <label className="px-4 py-2 bg-[#479bd7] hover:bg-[#5d9bc7] text-white rounded-md cursor-pointer transition-colors duration-200">
                      上傳 tazze 暢銷榜
                      <input
                        type="file"
                        onChange={handleFileChange("bestseller")}
                        className="hidden"
                        accept=".csv"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md">
                      <span className="truncate max-w-[150px]">
                        {uploadedFiles.bestseller.name}
                      </span>
                      <button
                        onClick={handleFileDelete("bestseller")}
                        className="ml-2 hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {!uploadedFiles.buyoff ? (
                    <label className="px-4 py-2 bg-[#479bd7] hover:bg-[#5d9bc7] text-white rounded-md cursor-pointer transition-colors duration-200">
                      上傳 tazze 買斷書籍
                      <input
                        type="file"
                        onChange={handleFileChange("buyoff")}
                        className="hidden"
                        accept=".csv"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md">
                      <span className="truncate max-w-[150px]">
                        {uploadedFiles.buyoff.name}
                      </span>
                      <button
                        onClick={handleFileDelete("buyoff")}
                        className="ml-2 hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {!uploadedFiles.trending ? (
                    <label className="px-4 py-2 bg-[#479bd7] hover:bg-[#5d9bc7] text-white rounded-md cursor-pointer transition-colors duration-200">
                      上傳 social media 趨勢書單
                      <input
                        type="file"
                        onChange={handleFileChange("trending")}
                        className="hidden"
                        accept=".csv"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md">
                      <span className="truncate max-w-[150px]">
                        {uploadedFiles.trending.name}
                      </span>
                      <button
                        onClick={handleFileDelete("trending")}
                        className="ml-2 hover:text-red-200"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* 
              {promptFile && (
                <div className="text-sm text-[#6B7C8C]">
                  已選擇檔案: {promptFile.name}
                </div>
              )} */}
            </div>
            <button
              type="submit"
              disabled={loading || !userId}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                loading || !userId
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-[#9147d7] hover:bg-[#bb5dc7] text-white"
              }`}
            >
              {loading ? "載入中..." : "產生推薦"}
            </button>
          </form>
        </div>
        {/* <button onClick={() => getUserCartAndOrders(userId)}>
          getUserCartAndOrders
        </button> */}

        {/* <div className="bg-[#FDF9F0] rounded-lg shadow-sm border border-[#E8DFC9] p-6 mb-4">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-medium text-[#4A5B6B] mb-3">
              用戶數據
            </h2> */}
        {/* {userCart && (
              <>
                <h3 className="text-md font-medium text-[#4A5B6B] mb-2">
                  購物車
                </h3>
                <Table
                  columns={cartColumns}
                  dataSource={userCart.items}
                  rowKey="update_time"
                  pagination={false}
                  className="mb-6"
                />
              </>
            )}

            {userOrders && (
              <>
                <h3 className="text-md font-medium text-[#4A5B6B] mb-2">
                  訂單歷史
                </h3>
                <Table
                  columns={orderColumns}
                  dataSource={userOrders.orders}
                  rowKey="created_time"
                  pagination={{ pageSize: 5 }}
                />
              </>
            )} */}
        {/* </div>
        </div> */}

        <div className="bg-[#FDF9F0] rounded-lg shadow-sm border border-[#E8DFC9] p-6 mb-4">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-medium text-[#4A5B6B] mb-3">
              AI 生成式偏好模型
            </h2>
            {advice !== "" && (
              <Markdown className="text-[#6B7C8C] leading-relaxed">
                {advice}
              </Markdown>
            )}
          </div>
        </div>
        {/* 書籍列表區域 */}
        {loading ? (
          <Loading />
        ) : (
          <div className="bg-[#d1e0e2] rounded-lg shadow-sm border border-[#E8DFC9] p-6 mb-4">
            <div className="prose prose-sm max-w-none">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium text-[#4A5B6B] mb-3">
                  AI 個性化書單
                </h2>
                <p className="text-[#6B7C8C]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                {books.map((book, index) => (
                  <div
                    key={index}
                    onClick={() => window.open(book.book_url, "_blank")}
                    className="bg-[#FDF9F0] relative rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-[#E8DFC9] p-6"
                  >
                    <div className="flex gap-6">
                      {/* <div className="w-32 h-40 bg-[#F0E6D0] rounded-md flex-shrink-0" /> */}
                      <div className="space-y-2">
                        <h3 className="text-[#4A5B6B] font-bold text-lg">
                          {book.book_title}
                        </h3>
                        <p className="text-[#6B7C8C] text-base">
                          {book.reason}
                        </p>
                        <a
                          href={book.book_url}
                          className="text-[#479bd7] hover:text-[#5d9bc7]"
                          target="_blank"
                        >
                          {book.book_url}
                        </a>
                      </div>
                    </div>
                    {/* <div className="absolute bottom-4 right-4">
                      <button className="text-xs text-[#6B7C8C]">
                        {new Date().toLocaleDateString()}
                      </button>
                    </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRecommendation;
