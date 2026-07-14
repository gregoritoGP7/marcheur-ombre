"use client";

import { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Copy, Trash2, Pencil, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WORKOUT_TYPES } from "@/data/workout-types";
import { WorkoutQuickForm } from "@/features/programs/components/workout-quick-form";
import type { Week } from "@/types/program";
import type { PlannedWorkout } from "@/types/workout";
import { cn } from "@/lib/utils";

export function WeekEditorBlock({
  week,
  onAddWorkout,
  onUpdateWorkout,
  onDeleteWorkout,
  onDuplicateWorkout,
  onDuplicateWeek,
  onDeleteWeek,
}: {
  week: Week;
  onAddWorkout: (values: Omit<PlannedWorkout, "id" | "weekId">) => void;
  onUpdateWorkout: (workoutId: string, values: Omit<PlannedWorkout, "id" | "weekId">) => void;
  onDeleteWorkout: (workoutId: string) => void;
  onDuplicateWorkout: (workoutId: string) => void;
  onDuplicateWeek: () => void;
  onDeleteWeek: () => void;
}) {
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Semaine {week.weekNumber}
            {week.label ? ` — ${week.label}` : ""}
          </CardTitle>
          <div className="flex gap-1">
            <Button size="icon" variant="ghost" onClick={onDuplicateWeek} title="Dupliquer la semaine">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
              onClick={() => {
                if (confirm(`Supprimer la semaine ${week.weekNumber} ?`)) onDeleteWeek();
              }}
              title="Supprimer la semaine"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Droppable droppableId={week.id}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2">
              {week.workouts.map((workout, index) => {
                const typeDef = WORKOUT_TYPES[workout.workoutTypeId];
                const Icon = typeDef.icon;
                const isEditing = editingId === workout.id;

                return (
                  <Draggable key={workout.id} draggableId={workout.id} index={index}>
                    {(dragProvided, snapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={cn(
                          "rounded-md border border-border bg-surface",
                          snapshot.isDragging && "shadow-elevated"
                        )}
                      >
                        {isEditing ? (
                          <div className="p-2">
                            <WorkoutQuickForm
                              initialValues={workout}
                              onSubmit={(values) => {
                                onUpdateWorkout(workout.id, {
                                  ...values,
                                  plannedDistanceKm:
                                    values.plannedDistanceKm === "" || values.plannedDistanceKm === undefined
                                      ? undefined
                                      : Number(values.plannedDistanceKm),
                                });
                                setEditingId(null);
                              }}
                              onCancel={() => setEditingId(null)}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-2 py-2">
                            <div {...dragProvided.dragHandleProps} className="text-muted-foreground">
                              <GripVertical className="h-4 w-4" />
                            </div>
                            <div
                              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
                              style={{ backgroundColor: `${typeDef.color}22`, color: typeDef.color }}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{workout.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(workout.date + "T00:00:00").toLocaleDateString("fr-FR", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                                {workout.plannedDistanceKm !== undefined
                                  ? ` · ${workout.plannedDistanceKm} km`
                                  : ""}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-0.5">
                              <Button size="icon" variant="ghost" onClick={() => setEditingId(workout.id)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => onDuplicateWorkout(workout.id)}>
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => onDeleteWorkout(workout.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {addingNew ? (
          <WorkoutQuickForm
            onSubmit={(values) => {
              onAddWorkout({
                ...values,
                plannedDistanceKm:
                  values.plannedDistanceKm === "" || values.plannedDistanceKm === undefined
                    ? undefined
                    : Number(values.plannedDistanceKm),
              });
              setAddingNew(false);
            }}
            onCancel={() => setAddingNew(false)}
          />
        ) : (
          <Button size="sm" variant="secondary" onClick={() => setAddingNew(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Ajouter une séance
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
