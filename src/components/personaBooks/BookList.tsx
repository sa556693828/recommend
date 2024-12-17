"use client";
import React, { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { BookData } from "@/types";
import { Message } from "@/types";

interface BookListProps {
  chatHistory: Message[];
  books: BookData[] | null;
  updateBookList: (book_id: string) => void;
}

const BookList = ({ chatHistory, books, updateBookList }: BookListProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenuId &&
        !(event.target as Element).closest(".menu-container")
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeMenuId]);
  return (
    <div className="p-4 h-full bg-black overflow-y-auto rounded-lg">
      {books &&
        books.length > 0 &&
        books.map((book, index) => (
          <div key={index} className="flex flex-col gap-1">
            <div className="flex gap-4 px-3 py-4 items-center">
              <div className="w-12 h-16 bg-white"></div>
              <div className="flex flex-col flex-1 gap-2">
                <div className="text-white">
                  {book.book_title?.split("：").map((part, index) => {
                    if (index === 0) {
                      return (
                        <p key={index} className="text-lg font-bold">
                          {part}：
                        </p>
                      );
                    } else {
                      return (
                        <p key={index} className="text-base text-white/30">
                          {part}
                        </p>
                      );
                    }
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <HiDotsHorizontal className="size-6 text-white" />
              </div>
            </div>
            <div className="w-full h-[1px] bg-white/30"></div>
          </div>
        ))}
      {chatHistory &&
        chatHistory.length > 0 &&
        chatHistory.map(
          (message) =>
            message.book_list &&
            message.book_list.length > 0 &&
            message.book_list.map((book, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex gap-4 px-3 py-4 items-center">
                  <div className="w-12 h-16 bg-white"></div>
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="text-white">
                      {book.book_title?.split("：").map((part, index) => {
                        if (index === 0) {
                          return (
                            <p key={index} className="text-lg font-bold">
                              {part}：
                            </p>
                          );
                        } else {
                          return (
                            <p key={index} className="text-base text-white/30">
                              {part}
                            </p>
                          );
                        }
                      })}
                    </div>
                  </div>
                  <div className="flex items-center justify-center relative menu-container">
                    <HiDotsHorizontal
                      className="size-6 text-white"
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === book.book_id ? null : book.book_id
                        )
                      }
                    />
                    {activeMenuId === book.book_id && (
                      <div className="absolute right-0 top-8 bg-gray-700 rounded-lg shadow-lg py-1 min-w-[120px] z-10">
                        <button
                          className="w-full px-4 py-2 text-left text-white hover:bg-gray-600"
                          onClick={() => {
                            updateBookList(book.book_id);
                            setActiveMenuId(null);
                          }}
                        >
                          沒興趣
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full h-[1px] bg-white/30"></div>
              </div>
            ))
        )}
    </div>
  );
};

export default BookList;
