import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface AgentState {
  messages: ChatMessage[];
  isStreaming: boolean;
  conversationId: string | null;
  addMessage: (message: ChatMessage) => void;
  appendToLastMessage: (content: string) => void;
  setStreaming: (streaming: boolean) => void;
  setConversationId: (id: string) => void;
  clearMessages: () => void;
}

export const useAgentStore = create<AgentState>()((set) => ({
  messages: [],
  isStreaming: false,
  conversationId: null,
  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),
  appendToLastMessage: (content) =>
    set((s) => {
      const messages = [...s.messages];
      const last = messages[messages.length - 1];
      if (last && last.role === "assistant") {
        messages[messages.length - 1] = {
          ...last,
          content: last.content + content,
        };
      }
      return { messages };
    }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setConversationId: (id) => set({ conversationId: id }),
  clearMessages: () => set({ messages: [], conversationId: null }),
}));
