import { ProgramForm } from "@/features/programs/components/program-form";

export default function NewProgramPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Nouveau programme</h1>
      <ProgramForm />
    </div>
  );
}
