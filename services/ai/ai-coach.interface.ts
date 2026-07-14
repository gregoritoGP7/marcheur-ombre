import type { CompletedSession } from "@/types/workout";
import type { Program } from "@/types/program";
import type { Goal } from "@/types/goal";

// Tout ce que le coach peut voir pour répondre — le jour où on branche une
// vraie API (Claude/OpenAI), ce contexte sera transformé en prompt système,
// mais sa forme ne changera pas.
export interface CoachContext {
  sessions: CompletedSession[];
  programs: Program[];
  goals: Goal[];
}

export interface AICoachService {
  ask(prompt: string, context: CoachContext): Promise<string>;
}
