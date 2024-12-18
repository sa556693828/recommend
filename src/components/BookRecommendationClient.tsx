"use client";
import ChatSection from "@/components/chating/ChatSection";
import BookList from "@/components/personaBooks/BookList";
import PersonaSelector from "@/components/personaBooks/PersonaSelector";
import { useChatHistoryStore } from "@/store/chatHistoryStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePersonaStore } from "@/store/usePersonaStore";
import { BookData, Message } from "@/types";
import React, { useCallback, useEffect, useState } from "react";

const BookRecommendationClient = () => {
  const { userId } = useAuthStore();
  const { personaId } = usePersonaStore();
  const { chatHistory, fetchChatHistory } = useChatHistoryStore();
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [queryLoading, setQueryLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentBook, setCurrentBook] = useState<BookData[] | null>(null);
  const [currentChat, setCurrentChat] = useState<Message[] | null>([]);
  // const [trendingBooks, setTrendingBooks] = useState<Books[]>([]);
  // const [personalizedBooks, setPersonalizedBooks] = useState<Books[]>([]);
  // const [bestSellerResponse, setBestSellerResponse] = useState();
  // const [trendingResponse, setTrendingResponse] = useState();
  // const [personalizedResponse, setPersonalizedResponse] = useState();

  const handleStream = useCallback(
    async (userId: string, personaId: string) => {
      setRecommendLoading(true);
      console.log(`start get ${userId} recommendation`);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_NGROK_URL;
        const response = await fetch(`${baseUrl}/recommendV2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            personaId: personaId,
          }),
        });
        // 檢查響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 檢查 response.body 是否為空
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        // setRecommendLoading(false);
        try {
          setIsStreaming(true);
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;

              if (line.includes("[DONE]")) {
                return; // 直接返回，結束整個函數
              }

              try {
                const parsedData = JSON.parse(line);
                if (parsedData.alsobuy_books) {
                  setCurrentBook((prev) => {
                    return [...(prev || []), ...parsedData.alsobuy_books];
                  });
                }
                if (parsedData.bestSell_books) {
                  setCurrentBook((prev) => {
                    return [...(prev || []), ...parsedData.bestSell_books];
                  });
                }
                if (parsedData.alsobuy_analysis) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    // 如果最後一條消息是AI的回應，則更新其內容
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content:
                          lastMessage.content + parsedData.alsobuy_analysis,
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.alsobuy_analysis,
                      },
                    ];
                  });
                }
                if (parsedData.prompts) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    // 如果最後一條消息是AI的回應，則更新其內容
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content: lastMessage.content,
                        prompts: parsedData.prompts,
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.content,
                        prompts: parsedData.prompts,
                      },
                    ];
                  });
                }
              } catch (e) {
                console.warn("Failed to parse line:", e);
              }
            }
          }
          if (buffer.trim() && !buffer.includes("[DONE]")) {
            try {
              const parsedData = JSON.parse(buffer);
              if (parsedData.alsobuy_books) {
                setCurrentBook((prev) => {
                  return [...(prev || []), ...parsedData.alsobuy_books];
                });
              }
              if (parsedData.bestSell_books) {
                setCurrentBook((prev) => {
                  return [...(prev || []), ...parsedData.bestSell_books];
                });
              }
              if (parsedData.alsobuy_analysis) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  // 如果最後一條消息是AI的回應，則更新其內容
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content:
                        lastMessage.content + parsedData.alsobuy_analysis,
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.alsobuy_analysis,
                    },
                  ];
                });
              }
              if (parsedData.prompts) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  // 如果最後一條消息是AI的回應，則更新其內容
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content: lastMessage.content,
                      prompts: parsedData.prompts,
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.content,
                      prompts: parsedData.prompts,
                    },
                  ];
                });
              }
            } catch (e) {
              console.warn("Failed to parse final buffer:", e);
            }
          }
        } finally {
          reader.releaseLock();
          setIsStreaming(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Stream error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setIsStreaming(false);
        setRecommendLoading(false);
      }
    },
    []
  );
  const handleQuery = useCallback(
    async (userId: string, inputValue: string, personaId: string) => {
      setQueryLoading(true);
      if (!userId || !personaId) return;
      try {
        setCurrentChat((prev) => [
          ...(prev || []),
          { role: "human", content: inputValue },
        ]);
        const baseUrl = process.env.NEXT_PUBLIC_NGROK_URL;
        const response = await fetch(`${baseUrl}/query_recommend`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            userQuery: inputValue,
            personaId: personaId,
          }),
        });
        // 檢查響應狀態
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // 檢查 response.body 是否為空
        if (!response.body) {
          throw new Error("Response body is null");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        // setQueryLoading(false);
        try {
          setIsStreaming(true);
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.trim()) continue;

              // 檢查是否收到結束信號
              if (line.includes("[DONE]")) {
                return; // 直接返回，結束整個函數
              }

              try {
                const parsedData = JSON.parse(line);
                if (parsedData.query_response) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    if (lastMessage && lastMessage.role === "ai") {
                      const newContent = parsedData.query_response;
                      if (!lastMessage.content.endsWith(newContent)) {
                        const updatedChat = [...(prev || [])];
                        updatedChat[updatedChat.length - 1] = {
                          role: "ai",
                          content:
                            lastMessage.content +
                            newContent.slice(lastMessage.content.length),
                        };
                        return updatedChat;
                      }
                      return prev;
                    } else {
                      return [
                        ...(prev || []),
                        {
                          role: "ai",
                          content: parsedData.query_response,
                        },
                      ];
                    }
                  });
                }
                if (parsedData.query_book_list) {
                  setCurrentBook((prev) => {
                    return [...parsedData.query_book_list, ...(prev || [])];
                  });
                }
                if (parsedData.query_result) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content: lastMessage.content + parsedData.query_result,
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.query_result,
                      },
                    ];
                  });
                }
                if (parsedData.prompts) {
                  setCurrentChat((prev) => {
                    const lastMessage = prev?.[prev.length - 1];
                    // 如果最後一條消息是AI的回應，則更新其內容
                    if (lastMessage && lastMessage.role === "ai") {
                      const updatedChat = [...prev];
                      updatedChat[updatedChat.length - 1] = {
                        role: "ai",
                        content: lastMessage.content,
                        prompts: parsedData.prompts,
                      };
                      return updatedChat;
                    }
                    return [
                      ...(prev || []),
                      {
                        role: "ai",
                        content: parsedData.content,
                        prompts: parsedData.prompts,
                      },
                    ];
                  });
                }
              } catch (e) {
                console.warn("Failed to parse line:", e);
              }
            }
          }
          if (buffer.trim() && !buffer.includes("[DONE]")) {
            try {
              const parsedData = JSON.parse(buffer);
              if (parsedData.query_response) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content: lastMessage.content + parsedData.query_response,
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.query_response,
                    },
                  ];
                });
              }
              if (parsedData.query_book_list) {
                setCurrentBook((prev) => {
                  return [...parsedData.query_book_list, ...(prev || [])];
                });
              }
              if (parsedData.query_result) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content: lastMessage.content + parsedData.query_result,
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.query_result,
                    },
                  ];
                });
              }
              if (parsedData.prompts) {
                setCurrentChat((prev) => {
                  const lastMessage = prev?.[prev.length - 1];
                  // 如果最後一條消息是AI的回應，則更新其內容
                  if (lastMessage && lastMessage.role === "ai") {
                    const updatedChat = [...prev];
                    updatedChat[updatedChat.length - 1] = {
                      role: "ai",
                      content: lastMessage.content,
                      prompts: parsedData.prompts,
                    };
                    return updatedChat;
                  }
                  return [
                    ...(prev || []),
                    {
                      role: "ai",
                      content: parsedData.content,
                      prompts: parsedData.prompts,
                    },
                  ];
                });
              }
            } catch (e) {
              console.warn("Failed to parse final buffer:", e);
            }
          }
        } finally {
          reader.releaseLock();
          setIsStreaming(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Stream error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
      } finally {
        setQueryLoading(false);
        setIsStreaming(false);
      }
    },
    []
  );
  const updateBookList = useCallback((book_id: string) => {
    setCurrentBook((prev) => {
      if (!prev) return null;
      const filtered = prev.filter((book) => book.book_id !== book_id);
      return filtered.length > 0 ? filtered : null;
    });
  }, []);

  useEffect(() => {
    if (userId && personaId) {
      setCurrentBook(null);
      setCurrentChat(null);
      fetchChatHistory(userId, personaId);
    }
  }, [userId, personaId]);

  useEffect(() => {
    if (chatHistory && chatHistory.length === 0) {
      if (!userId || !personaId) return;
      handleStream(userId, personaId);
    }
  }, [chatHistory]);
  return (
    <div
      className="flex justify-start w-full gap-2 pb-2 px-2 bg-[#e8e8e8]"
      style={{
        height: "calc(100vh - 52px)",
      }}
    >
      <ChatSection
        currentChat={currentChat || []}
        chatHistory={chatHistory || []}
        isStreaming={isStreaming}
        isLoading={recommendLoading || queryLoading || chatHistory === null}
        handleQuery={handleQuery}
      />
      <div className="w-1/2 mx-auto relative bg-transparent rounded-lg flex flex-col gap-2 h-[calc(100vh-60px)]">
        <PersonaSelector isStreaming={isStreaming} />
        <BookList
          chatHistory={chatHistory || []}
          books={currentBook || []}
          updateBookList={updateBookList}
        />
      </div>
    </div>
  );
};

export default BookRecommendationClient;
