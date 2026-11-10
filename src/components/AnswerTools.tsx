import { useState } from "react";

// Copy an answer, or send it with the phone's share sheet.
export default function AnswerTools({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const canShare = typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }
  async function share() {
    try {
      await navigator.share({ text: `${text}\n\nGrape Bot 🍇 https://bandicroc-niagaragrapes.pages.dev` });
    } catch {
      /* closed the share sheet */
    }
  }

  return (
    <div className="answer-tools">
      <button onClick={copy} aria-label="Copy answer">
        {copied ? "✓ Copied" : "📋 Copy"}
      </button>
      {canShare && (
        <button onClick={share} aria-label="Share answer">
          📤 Share
        </button>
      )}
    </div>
  );
}
