import { Message } from "@/types";
import axios from "axios";
import { create } from "zustand";

interface ChatHistoryState {
  chatHistory: Message[] | null;
  isLoading: boolean;
  fetchChatHistory: (userId: string, personaId: string) => Promise<void>;
  deleteChatHistory: (userId: string, personaId: string) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set) => ({
  chatHistory: null,
  isLoading: false,
  fetchChatHistory: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`
      );
      const data = response.data;
      if (data.success) {
        set({ chatHistory: data.userHistories || [] });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  deleteChatHistory: async (userId: string, personaId: string) => {
    try {
      set({ isLoading: true });
      const response = await axios.delete(
        `/api/chatHistory?userId=${userId}&personaId=${personaId}`
      );
      const data = response.data;
      if (data.success) {
        set({ chatHistory: [] });
      }
    } catch (error) {
      console.error("Error deleting chat history:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
