"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm Damir, senior payment solutions consultant at Qosvanta.\n\nQosvanta is a global aggregator of payment methods — fiat, crypto, e-wallets and local rails worldwide. We work with businesses across every risk level.\n\nTell me about your business and I'll help you find the right setup. Feel free to write in any language 🌍",
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    function openFromHash() {
      if (typeof window !== "undefined" && window.location.hash === "#open-chat") {
        setOpen(true);
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    }
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  useEffect(() => {
    function onPrefill(e: Event) {
      const detail = (e as CustomEvent<{ text: string }>).detail;
      if (!detail?.text) return;
      setOpen(true);
      setInput(detail.text);
      setTimeout(() => {
        const el = inputRef.current;
        if (el) {
          el.focus();
          el.setSelectionRange(el.value.length, el.value.length);
        }
      }, 150);
    }
    window.addEventListener("qosvanta:prefill-chat", onPrefill);
    return () => window.removeEventListener("qosvanta:prefill-chat", onPrefill);
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send only actual conversation (skip welcome message from API call)
      const apiMessages = newMessages
        .filter((m) => !(m.role === "assistant" && m === WELCOME))
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.message || "...",
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (data.applicationSubmitted) setSubmitted(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleReset() {
    setMessages([WELCOME]);
    setSubmitted(false);
    setInput("");
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-3 left-3 sm:left-auto sm:right-5 z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            maxWidth: 360,
            width: "auto",
            height: "min(540px, calc(100vh - 140px))",
            background: "#FFFFFF",
            border: "1px solid rgba(15,23,42,0.1)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #0D0F1E, #1a1d35)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
              >
                D
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Damir</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                    Qosvanta · online
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Start over"
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ background: "#F8F9FF" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mr-2 mt-0.5"
                    style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
                  >
                    D
                  </div>
                )}
                <div
                  className="max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? {
                          background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
                          color: "#FFFFFF",
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: "#FFFFFF",
                          color: "#1E293B",
                          border: "1px solid rgba(15,23,42,0.08)",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)", color: "#07081C" }}
                >
                  D
                </div>
                <div
                  className="px-4 py-3 rounded-2xl"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(15,23,42,0.08)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    borderBottomLeftRadius: 4,
                  }}
                >
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: "#CBD5E1",
                          animation: "bounce 1.2s infinite",
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Application submitted banner */}
            {submitted && (
              <div
                className="mx-2 px-3 py-2.5 rounded-xl text-xs text-center"
                style={{ background: "rgba(5,150,105,0.08)", border: "1px solid rgba(5,150,105,0.2)", color: "#059669" }}
              >
                ✓ Application submitted — a specialist will get back to you within 24 hours
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="flex-shrink-0 px-3 py-3 flex items-end gap-2"
            style={{ borderTop: "1px solid rgba(15,23,42,0.08)", background: "#FFFFFF" }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              disabled={loading}
              className="flex-1 resize-none rounded-xl px-3 py-2.5 text-sm outline-none transition-colors"
              style={{
                background: "rgba(15,23,42,0.04)",
                border: "1px solid rgba(15,23,42,0.10)",
                color: "#0D0F1E",
                maxHeight: 96,
                lineHeight: "1.5",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-85 disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E2C97E)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#07081C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Footer link */}
          <div
            className="flex-shrink-0 px-4 py-2 flex items-center justify-center gap-1"
            style={{ borderTop: "1px solid rgba(15,23,42,0.06)", background: "#FAFBFF" }}
          >
            <a
              href="https://t.me/damir_qosvantabot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: "#94A3B8" }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z" />
              </svg>
              Open in Telegram
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          width: 52,
          height: 52,
          background: "linear-gradient(135deg, #C9A84C, #E2C97E)",
          boxShadow: "0 4px 24px rgba(201,168,76,0.40)",
        }}
        aria-label="Open chat"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#07081C" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#07081C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
        {/* Pulse ring */}
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 52,
            height: 52,
            border: "2px solid rgba(201,168,76,0.5)",
            animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
          }}
        />
      </button>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </>
  );
}
