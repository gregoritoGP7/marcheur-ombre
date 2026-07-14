"use client";

import { useCompletedSessions } from "@/hooks/use-completed-sessions";
import { usePrograms } from "@/hooks/use-programs";
import { useGoals } from "@/hooks/use-goals";
import { ChatInterface } from "@/features/coach/components/chat-interface";

export default function CoachPage() {
  const { sessions } = useCompletedSessions();
  const { programs } = usePrograms();
  const { goals } = useGoals();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Coach IA</h1>
      <ChatInterface context={{ sessions, programs, goals }} />
    </div>
  );
}
