"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState } from "react";
import { logIn } from "../actions";
import { LoaderCircle } from "lucide-react";

export default function Login() {
  const [state, formAction, isPending] = useActionState(logIn, {
    message: "",
    isError: false,
  });

  return (
    <form
      className="flex flex-col max-w-md gap-4 m-auto h-screen justify-center"
      action={formAction}
    >
      <div className="text-xl text-center">Log In to Harmony</div>
      <div>
        {state.isError && (
          <span className="text-destructive text-base">{state.message}</span>
        )}
        <Input type="text" name="email" placeholder="Email" />
      </div>
      <Button disabled={isPending} type="submit">
        {isPending ? <LoaderCircle className="animate-spin" /> : "Sign In"}
      </Button>
    </form>
  );
}
