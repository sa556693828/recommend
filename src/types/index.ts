export interface Message {
  role: "human" | "ai";
  content: string;
  book_list?: BookData[];
  prompts?: string[];
}
export interface UserHistory {
  user_id: string;
  persona_id: string;
  messages: Message[];
}
export interface Persona {
  _id: string;
  persona_name: string;
  system_prompt_en: string;
  intro: string;
  intro_en: string;
  waiting_message: string[];
  system_prompt: string;
}
export interface BookData {
  book_id: string;
  book_title: string;
  book_url: string;
  book_image?: string;
}
