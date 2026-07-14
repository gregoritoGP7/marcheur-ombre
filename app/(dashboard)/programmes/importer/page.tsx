import { ImportPanel } from "@/features/import/components/import-panel";

export default function ImportPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-2xl font-bold">Importer un programme</h1>
      <ImportPanel />
    </div>
  );
}
