"use client";
import React, { useEffect, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { BookData } from "@/types";
import { BsFillHandThumbsDownFill } from "react-icons/bs";
import Image from "next/image";
import { FaBook } from "react-icons/fa";

interface BookRowProps {
  book: BookData;
  updateBookList: (book_id: string) => void;
}

const BookRow = ({ book, updateBookList }: BookRowProps) => {
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
    <div className="flex flex-col gap-1 ">
      <div className="flex px-3 py-4 items-center justify-between">
        <div
          className="flex items-center w-full justify-start cursor-pointer gap-4 hover:translate-x-2 transition-all duration-300"
          onClick={() => {
            if (book.book_url) {
              window.open(book.book_url, "_blank");
            }
          }}
        >
          {book?.book_id ? (
            <Image
              src={`https://media.taaze.tw/showThumbnail.html?sc=${book.book_id}&height=400&width=310`}
              alt={book.book_title}
              className="w-12 h-16"
              width={44}
              height={60}
            />
          ) : (
            <div className="w-12 h-16 bg-transparent flex items-center justify-center">
              <FaBook className="size-4" color="#FFFFFF" />
            </div>
          )}
          <div className="flex flex-col flex-1 gap-2">
            <div className="text-white">
              {book.book_title?.includes("：") ? (
                // 如果標題包含冒號，分開顯示
                book.book_title.split("：").map((part, index) => {
                  if (index === 0) {
                    return (
                      <p key={index} className="text-lg font-bold">
                        {part}：
                      </p>
                    );
                  } else {
                    return (
                      <p
                        key={index}
                        className="text-base font-bold text-white/60"
                      >
                        {part}
                      </p>
                    );
                  }
                })
              ) : (
                // 如果標題不包含冒號，整個使用粗體
                <p className="text-lg font-bold">{book.book_title}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center relative cursor-pointer menu-container">
          <HiDotsHorizontal
            className="size-6 text-white"
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(
                activeMenuId === book.book_id ? null : book.book_id
              );
            }}
          />
          {activeMenuId === book.book_id && (
            <div className="absolute right-0 top-8 bg-[#D7D7D7] hover:bg-[#D7D7D7]/80 rounded-lg min-w-[120px] z-10">
              <button
                className="w-full px-3 py-2 text-black text-xs flex items-center justify-between gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  updateBookList(book.book_id);
                  setActiveMenuId(null);
                }}
              >
                沒興趣
                <BsFillHandThumbsDownFill className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-[1px] bg-white/30"></div>
    </div>
  );
};

export default BookRow;
