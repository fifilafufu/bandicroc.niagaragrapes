// Chat message types and the greeting, shared by the chat screen and the chat sync,
// kept out of Chat.tsx so the chat screen can load only when it's opened.

type Source = { title: string; url: string; data?: boolean }; // data: a statistics source (OIV, FAO), not Wikipedia
type Photo = { wiki: string; name: string; src: string };

export type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  followUps?: string[];
  photos?: Photo[];
  pending?: boolean; // still being written
  id?: string;
};

export const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Grape Bot, your grape tutor. Ask me anything about grapes, and I'll answer from checked facts and Wikipedia. 🍇",
};
