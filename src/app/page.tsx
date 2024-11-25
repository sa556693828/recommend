"use client";
import Loading from "@/components/Loading";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";

interface RecommendationResponse {
  advice: string;
  books: {
    book_id: string;
    book_title: string;
    book_url: string;
    reason: string;
  }[];
}
//TODO:交易數據、收藏、分析，寫了一個癮琴去分析他的東西，
//TODO:從歷史數據or等等分析他的行為
//TODO:趨勢的prompting，編輯推薦的書（上傳買斷的書
//TODO:暢銷排行榜
//TODO:比例
interface FileState {
  bestseller?: File;
  purchased?: File;
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
    { id: 1, text: "幫我產生10本推薦書籍" },
    { id: 2, text: "請根據我提供的促銷書單，多提供給用戶我促銷的書籍" },
    { id: 3, text: "告訴用戶推薦原因時，請多提供一些書籍的背景知識" },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const env = process.env.NODE_ENV;
    const baseUrl =
      env === "development"
        ? "http://54.238.1.161:9001"
        : `${process.env.NEXT_PUBLIC_NGROK_URL}/demo`;

    try {
      const formData = new FormData();

      if (uploadedFiles) {
        Object.entries(uploadedFiles).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);
          }
        });
      }
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
                    {filteredUserIds.map((id) => (
                      <button
                        key={id}
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

                  {!uploadedFiles.purchased ? (
                    <label className="px-4 py-2 bg-[#479bd7] hover:bg-[#5d9bc7] text-white rounded-md cursor-pointer transition-colors duration-200">
                      上傳 tazze 買斷書籍
                      <input
                        type="file"
                        onChange={handleFileChange("purchased")}
                        className="hidden"
                        accept=".csv"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md">
                      <span className="truncate max-w-[150px]">
                        {uploadedFiles.purchased.name}
                      </span>
                      <button
                        onClick={handleFileDelete("purchased")}
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
        <div className="bg-[#FDF9F0] rounded-lg shadow-sm border border-[#E8DFC9] p-6 mb-4">
          <div className="prose prose-sm max-w-none">
            <h2 className="text-lg font-medium text-[#4A5B6B] mb-3">
              AI生成式偏好模式設計
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
          <div className="space-y-4">
            {books.map((book) => (
              <div
                key={book.book_id}
                onClick={() => window.open(book.book_url, "_blank")}
                className="bg-[#FDF9F0] rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-shadow border border-[#E8DFC9] p-6"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-40 bg-[#F0E6D0] rounded-md flex-shrink-0" />
                  <div className="space-y-2">
                    <h3 className="text-[#4A5B6B] font-bold text-lg">
                      {book.book_title}
                    </h3>
                    <p className="text-[#6B7C8C] text-base">{book.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookRecommendation;
