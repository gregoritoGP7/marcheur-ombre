import { getQuoteOfDay } from "@/data/quotes";

export function DailyQuote() {
  return (
    <p className="text-center text-sm italic text-muted-foreground">
      &ldquo;{getQuoteOfDay()}&rdquo;
    </p>
  );
}
