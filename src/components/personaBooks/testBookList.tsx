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
        .filter(
          (book, index, self) =>
            index === self.findIndex((b) => b.book_id === book.book_id)
        );

      if (books) {
        const bookMap = new Map();

        chatHistory_bookList_distinct.forEach((book) => {
          if (!bookMap.has(book.book_id)) {
            bookMap.set(book.book_id, book);
          }
        });

        books.forEach((book) => {
          bookMap.set(book.book_id, book);
        });

        const newBooksList = books.filter((book) => bookMap.has(book.book_id));

        const remainingBooks = Array.from(bookMap.values()).filter(
          (book) => !books.some((newBook) => newBook.book_id === book.book_id)
        );

        setBookListDistinct([...newBooksList, ...remainingBooks]);
      }
    }
  }, [chatHistory, books]);

  useEffect(() => {
    if (books) {
      const previousBooksMap = new Map(
        bookListDistinct.map((book, index) => [book.book_id, index])
      );

      const newBooksMap = new Map(
        books.map((book, index) => [book.book_id, index])
      );

      const newIds = new Set(
        books
          .filter((book) => {
            const previousIndex = previousBooksMap.get(book.book_id);
            return (
              previousIndex === undefined ||
              previousIndex !== newBooksMap.get(book.book_id)
            );
          })
          .map((book) => book.book_id)
      );
      console.log("newIds", newIds);
      setNewBookIds(newIds);

      const timer = setTimeout(() => {
        setNewBookIds(new Set());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [books, bookListDistinct]);

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
            className={newBookIds.has(book.book_id) ? "animate-fade-in" : ""}
          />
        ))}
    </div>
  );
};

export default BookList;
