"use client";
import React, { useEffect, useState } from "react";
import { BookData } from "@/types";
import { Message } from "@/types";
import BookRow from "./BookRow";

interface BookListProps {
  chatHistory: Message[];
  books: BookData[] | null;
  updateBookList: (book_id: string) => void;
}

const BookList = ({ chatHistory, books, updateBookList }: BookListProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const ChatHistory_bookList_distinct = [...chatHistory]
    .reverse()
    .flatMap((message) => message.book_list || [])
    .filter(
      (book, index, self) =>
        index === self.findIndex((b) => b.book_id === book.book_id)
    );
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
          <BookRow key={index} book={book} updateBookList={updateBookList} />
        ))}
      {chatHistory &&
        chatHistory.length > 0 &&
        ChatHistory_bookList_distinct.map((book, index) => (
          <BookRow key={index} book={book} updateBookList={updateBookList} />
        ))}
    </div>
  );
};

export default BookList;
