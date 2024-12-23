"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BookData } from "@/types";
import { Message } from "@/types";
import BookRow from "./BookRow";

interface BookListProps {
  chatHistory: Message[];
  books: BookData[] | null;
}

const AnimationBookList = ({ chatHistory, books }: BookListProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [bookListDistinct, setBookListDistinct] = useState<BookData[]>([]);
  const [newBookIds, setNewBookIds] = useState<Set<string>>(new Set());

  const updateBookList = useCallback((book_id: string) => {
    setBookListDistinct((prev) => {
      const filtered = prev.filter((book) => book.book_id !== book_id);
      return filtered.length > 0 ? filtered : [];
    });
  }, []);

  useEffect(() => {
    if (chatHistory.length >= 0) {
      const chatHistory_bookList_distinct = [...chatHistory]
        .reverse()
        .flatMap((message) => message.book_list || [])
        .filter((book) => book.book_id.startsWith("111"))
        .filter(
          (book, index, self) =>
            index === self.findIndex((b) => b.book_id === book.book_id)
        );

      if (books) {
        // 先過濾掉不是 111 開頭的書籍，再處理重複項
        const distinctBooks = books
          .filter((book) => book.book_id.startsWith("111"))
          .filter(
            (book, index, filteredBooks) =>
              filteredBooks.findIndex((b) => b.book_id === book.book_id) ===
              index
          );

        // 過濾掉在 distinctBooks 中出現的聊天記錄書籍
        const filteredChatHistory = chatHistory_bookList_distinct.filter(
          (chatBook) =>
            !distinctBooks.some((book) => book.book_id === chatBook.book_id)
        );

        const newIds = new Set(distinctBooks.map((book) => book.book_id));

        setNewBookIds(newIds);
        setBookListDistinct([...distinctBooks, ...filteredChatHistory]);
      }
    }
  }, [chatHistory, books]);

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
      {bookListDistinct &&
        bookListDistinct.length > 0 &&
        bookListDistinct.map((book) => (
          <BookRow
            key={book.book_id}
            book={book}
            updateBookList={updateBookList}
            className={newBookIds.has(book.book_id) ? "animate-slide-in" : ""}
          />
        ))}
    </div>
  );
};

export default AnimationBookList;
