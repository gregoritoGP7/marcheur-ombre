"use client";

import { useState } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MessageBubble, type ChatMessage } from "@/features/coach/components/message-bubble";
import { SUGGESTED_PROMPTS } from "@/features/coach/data/suggested-prompts";
import { mockAICoachService } from "@/services/ai/mock-ai-coach.service";
import type { CoachContext } from "@/services/ai/ai-coach.interface";

const INTRO_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Salut ! Je suis ton Coach — version démo pour l'instant (réponses préprogrammées à partir de tes vraies données, pas encore une vraie IA). Pose-moi une question ou choisis une suggestion ci-dessous.",
};

export function ChatInterface({ context }: { context: CoachContext }) {
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  async function send(text: string) {
    if (!text.trim() || isThinking) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsThinking(true);
    const answer = await mockAICoachService.ask(text, context);
    setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    setIsThinking(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardContent className="flex flex-col gap-3 py-4">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {isThinking && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Bot className="h-3.5 w-3.5" /> Réflexion...
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => send(prompt)}
            className="rounded-full border border-border bg-surface-elevated px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
        />
        <Button type="submit" size="icon" disabled={isThinking}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
