"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";

import { ApiError } from "@/lib/api";
import { getVoiceToken } from "@/lib/patient-api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
}

function newId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function VoiceConversation() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => setError(null),
    onDisconnect: () => {},
    onError: (message: string) => setError(typeof message === "string" ? message : "Connection error."),
    onMessage: (payload: { message: string; source: string }) => {
      if (!payload?.message) return;
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: payload.source === "user" ? "user" : "ai", text: payload.message },
      ]);
    },
  });

  const status = conversation.status; // "connected" | "connecting" | "disconnected"
  const connected = status === "connected";
  const isSpeaking = conversation.isSpeaking;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const start = async () => {
    setError(null);
    setStarting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      // The backend mints a per-conversation WebRTC token using the account API
      // key (in apps/api/.env) and the doctor's agent id (in the DB).
      const { token } = await getVoiceToken();
      await conversation.startSession({ conversationToken: token, connectionType: "webrtc" });
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setError("Microphone access is required to talk. Please allow it and try again.");
      } else if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Could not start the conversation. Please try again.");
      }
    } finally {
      setStarting(false);
    }
  };

  const stop = async () => {
    try {
      await conversation.endSession();
    } catch {
      /* ignore */
    }
  };

  const sendText = () => {
    const value = text.trim();
    if (!value || !connected) return;
    conversation.sendUserMessage(value);
    setMessages((prev) => [...prev, { id: newId(), role: "user", text: value }]);
    setText("");
  };

  const statusLabel = starting
    ? "Connecting…"
    : status === "connecting"
      ? "Connecting…"
      : connected
        ? isSpeaking
          ? "Speaking…"
          : "Listening…"
        : "Tap to start";

  return (
    <div className="w-full max-w-xl rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:p-8">
      {/* Avatar + status */}
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <span
            className={`absolute -inset-2 rounded-full border-2 border-brand-300 ${
              connected ? "animate-ping" : "opacity-0"
            }`}
          />
          <div
            className={`relative h-28 w-28 overflow-hidden rounded-full border-4 bg-brand-50 transition-colors ${
              isSpeaking ? "border-brand-400" : "border-brand-100"
            }`}
          >
            <Image
              src="/dr_surbhi_avatar.png"
              alt="Dr. Surbhi's AI receptionist"
              fill
              sizes="112px"
              className="object-cover object-top"
              priority
            />
          </div>
        </div>
        <h2 className="mt-4 text-lg font-bold text-sage-900">Dr. Surbhi&apos;s Receptionist</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-sage-500">
          <span
            className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-sage-300"}`}
          />
          {statusLabel}
        </p>

        <div className="mt-5">
          {connected ? (
            <Button variant="danger" onClick={stop}>
              End call
            </Button>
          ) : (
            <Button onClick={start} disabled={starting}>
              {starting ? "Connecting…" : "Start talking"}
            </Button>
          )}
        </div>
      </div>

      {/* Transcript */}
      <div
        ref={scrollRef}
        className="mt-6 flex h-72 flex-col gap-3 overflow-y-auto rounded-2xl border border-brand-50 bg-cream-50/40 p-4"
      >
        {messages.length === 0 ? (
          <p className="m-auto max-w-xs text-center text-sm text-sage-400">
            Start the call and just talk — ask about services or book an appointment. Your
            conversation will appear here.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.role === "user"
                    ? "rounded-br-sm bg-brand-500 text-white"
                    : "rounded-bl-sm border border-brand-50 bg-white text-sage-700"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Text input */}
      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendText();
        }}
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={connected ? "Type a message…" : "Start the call to type"}
          disabled={!connected}
          className="flex-1"
        />
        <Button type="submit" disabled={!connected || !text.trim()}>
          Send
        </Button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
