// Chat message types and the greeting, shared by the chat screen and the chat sync,
// kept out of Chat.tsx so the chat screen can load only when it's opened.

type Source = { title: string; url: string; data?: boolean }; // data: a statistics source (OIV, FAO), not Wikipedia
type Photo = { wiki: string; name: string; src: string; credit?: { author: string; licence: string; page: string } };

export type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  followUps?: string[];
  photos?: Photo[];
  pending?: boolean; // still being written
  id?: string;
};

// The AI sometimes writes Markdown (**bold**, # headings) although it is asked for plain text.
// Answers are shown as plain text, so the marks are taken out instead of showing as stars.
export const plainAnswer = (text: string) => text.replace(/\*\*|__/g, "").replace(/^#{1,6}\s+/gm, "");

export const GREETING: Msg = {
  role: "assistant",
  content: "Hi! I'm Grape Bot, your grape tutor. Ask me anything about grapes, and I'll answer from checked facts and Wikipedia. 🍇",
};

export const SUGGESTIONS = [
  "Where are grapes from?",
  "Can dogs eat grapes?",
  "What colours do grapes come in?",
  "What's my favourite grape?",
];
