"use client";

import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui/Spinner";

// The ElevenLabs SDK is browser-only (WebRTC/mic), so load it client-side only —
// this keeps it out of server prerendering.
const VoicePanel = dynamic(
  () => import("@/features/voice/VoicePanel").then((m) => m.VoicePanel),
  {
    ssr: false,
    loading: () => (
      <div className="flex w-full max-w-xl items-center justify-center gap-2 rounded-3xl border border-sage-200/70 bg-white p-10 text-sm text-sage-500 shadow-card">
        <Spinner /> Loading the receptionist…
      </div>
    ),
  },
);

export function VoicePanelClient() {
  return <VoicePanel />;
}
