"use client";
import { deleteThread } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export function DeleteButton({ id }: { id: string }) {
  const deleteAction = async () => {
    await deleteThread({ id: id });
  };

  return (
    <Button
      variant="ghost"
      onClick={deleteAction}
      className="h-10 w-10 ml-auto"
    >
      <Delete />
    </Button>
  );
}
