"use client";

import { ConversationProvider } from "@elevenlabs/react";

import { VoiceConversation } from "@/features/voice/VoiceConversation";

// useConversation() must live inside a ConversationProvider (SDK v1.x).
export function VoicePanel() {
  return (
    <ConversationProvider>
      <VoiceConversation />
    </ConversationProvider>
  );
}
