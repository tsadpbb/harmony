"use client";
import { deleteThread } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Delete, LoaderCircle } from "lucide-react";
import { useTransition } from "react";

export function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function deleteAction() {
    startTransition(async () => {
      await deleteThread({ id: id });
    });
  }

  return (
    <Button
      variant="ghost"
      onClick={deleteAction}
      className="h-10 w-10 ml-auto"
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : <Delete />}
    </Button>
  );
}
