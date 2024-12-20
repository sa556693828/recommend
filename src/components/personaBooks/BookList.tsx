"use client";
import React, { useCallback, useEffect, useState } from "react";
import { BookData } from "@/types";
import { Message } from "@/types";
import BookRow from "./BookRow";

interface BookListProps {
  chatHistory: Message[];
  books: BookData[] | null;
}

const BookList = ({ chatHistory, books }: BookListProps) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [bookListDistinct, setBookListDistinct] = useState<BookData[]>([]);
  const updateBookList = useCallback((book_id: string) => {
    setBookListDistinct((prev) => {
      const filtered = prev.filter((book) => book.book_id !== book_id);
      return filtered.length > 0 ? filtered : [];
    });
  }, []);

  useEffect(() => {
    const chatHistory_bookList_distinct = [...chatHistory]
      .reverse()
      .flatMap((message) => message.book_list || [])
      .filter(
        (book, index, self) =>
          index === self.findIndex((b) => b.book_id === book.book_id)
      );
    const books_distinct = books
      ? books.filter(
          (book, index, self) =>
            index === self.findIndex((b) => b.book_id === book.book_id)
        )
      : [];

    setBookListDistinct([...books_distinct, ...chatHistory_bookList_distinct]);
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
        bookListDistinct.map((book, index) => (
          <BookRow key={index} book={book} updateBookList={updateBookList} />
        ))}
      {/* {chatHistory &&
        chatHistory.length > 0 &&
        chatHistory_bookList_distinct.map((book, index) => (
          <BookRow key={index} book={book} updateBookList={updateBookList} />
        ))} */}
    </div>
  );
};

export default BookList;
