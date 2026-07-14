"use client";

import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeekEditorBlock } from "@/features/programs/components/week-editor-block";
import { storage } from "@/services/storage/local.adapter";
import type { Program, Week } from "@/types/program";
import type { PlannedWorkout } from "@/types/workout";

export function ProgramEditor({ program }: { program: Program }) {
  const weeks = program.weeks.slice().sort((a, b) => a.weekNumber - b.weekNumber);

  async function persist(nextWeeks: Week[]) {
    // Renumérote toujours les semaines dans l'ordre pour éviter les trous
    // (ex: après suppression de la semaine 2 sur 3).
    const renumbered = nextWeeks.map((w, i) => ({ ...w, weekNumber: i + 1 }));
    await storage.saveProgram({ ...program, weeks: renumbered });
  }

  function addWeek() {
    const newWeek: Week = {
      id: crypto.randomUUID(),
      programId: program.id,
      weekNumber: weeks.length + 1,
      workouts: [],
    };
    persist([...weeks, newWeek]);
  }

  function deleteWeek(weekId: string) {
    persist(weeks.filter((w) => w.id !== weekId));
  }

  function duplicateWeek(weekId: string) {
    const source = weeks.find((w) => w.id === weekId);
    if (!source) return;

    const newWeekId = crypto.randomUUID();
    const clonedWorkouts = source.workouts.map((w) => {
      const shiftedDate = new Date(w.date + "T00:00:00");
      shiftedDate.setDate(shiftedDate.getDate() + 7 * (weeks.length - weeks.indexOf(source)));
      return {
        ...w,
        id: crypto.randomUUID(),
        weekId: newWeekId,
        completedSessionId: undefined,
        date: shiftedDate.toISOString().slice(0, 10),
      };
    });
    const newWeek: Week = {
      id: newWeekId,
      programId: program.id,
      weekNumber: weeks.length + 1,
      label: source.label,
      workouts: clonedWorkouts,
    };
    persist([...weeks, newWeek]);
  }

  function addWorkout(weekId: string, values: Omit<PlannedWorkout, "id" | "weekId">) {
    const next = weeks.map((w) =>
      w.id === weekId
        ? { ...w, workouts: [...w.workouts, { ...values, id: crypto.randomUUID(), weekId }] }
        : w
    );
    persist(next);
  }

  function updateWorkout(
    weekId: string,
    workoutId: string,
    values: Omit<PlannedWorkout, "id" | "weekId">
  ) {
    const next = weeks.map((w) =>
      w.id === weekId
        ? {
            ...w,
            workouts: w.workouts.map((wk) =>
              wk.id === workoutId ? { ...wk, ...values } : wk
            ),
          }
        : w
    );
    persist(next);
  }

  function deleteWorkout(weekId: string, workoutId: string) {
    const next = weeks.map((w) =>
      w.id === weekId ? { ...w, workouts: w.workouts.filter((wk) => wk.id !== workoutId) } : w
    );
    persist(next);
  }

  function duplicateWorkout(weekId: string, workoutId: string) {
    const next = weeks.map((w) => {
      if (w.id !== weekId) return w;
      const source = w.workouts.find((wk) => wk.id === workoutId);
      if (!source) return w;
      return {
        ...w,
        workouts: [
          ...w.workouts,
          { ...source, id: crypto.randomUUID(), completedSessionId: undefined },
        ],
      };
    });
    persist(next);
  }

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceWeek = weeks.find((w) => w.id === source.droppableId);
    const destWeek = weeks.find((w) => w.id === destination.droppableId);
    if (!sourceWeek || !destWeek) return;

    const movedWorkout = sourceWeek.workouts.find((w) => w.id === draggableId);
    if (!movedWorkout) return;

    const next = weeks.map((w) => {
      if (w.id === sourceWeek.id && w.id === destWeek.id) {
        // Réordonner dans la même semaine
        const withoutMoved = w.workouts.filter((wk) => wk.id !== draggableId);
        withoutMoved.splice(destination.index, 0, movedWorkout);
        return { ...w, workouts: withoutMoved };
      }
      if (w.id === sourceWeek.id) {
        return { ...w, workouts: w.workouts.filter((wk) => wk.id !== draggableId) };
      }
      if (w.id === destWeek.id) {
        const nextWorkouts = w.workouts.slice();
        // La date d'origine est conservée — modifiable via le crayon si besoin.
        nextWorkouts.splice(destination.index, 0, { ...movedWorkout, weekId: destWeek.id });
        return { ...w, workouts: nextWorkouts };
      }
      return w;
    });

    persist(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <DragDropContext onDragEnd={onDragEnd}>
        {weeks.map((week) => (
          <WeekEditorBlock
            key={week.id}
            week={week}
            onAddWorkout={(values) => addWorkout(week.id, values)}
            onUpdateWorkout={(workoutId, values) => updateWorkout(week.id, workoutId, values)}
            onDeleteWorkout={(workoutId) => deleteWorkout(week.id, workoutId)}
            onDuplicateWorkout={(workoutId) => duplicateWorkout(week.id, workoutId)}
            onDuplicateWeek={() => duplicateWeek(week.id)}
            onDeleteWeek={() => deleteWeek(week.id)}
          />
        ))}
      </DragDropContext>

      <Button variant="secondary" onClick={addWeek}>
        <Plus className="mr-1.5 h-4 w-4" /> Ajouter une semaine
      </Button>
    </div>
  );
}
