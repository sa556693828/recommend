"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import BookRecommendationClient from "@/components/BookRecommendationClient";

const BookRecommendation = () => {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/login");
    }
  }, [router]);

  return <BookRecommendationClient />;
};

export default BookRecommendation;
