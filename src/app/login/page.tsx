import { Button } from "@/components/ui/button";
import { signIn } from "../actions/auth";
import { Input } from "@/components/ui/input";

export default function Login() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("resend", formData);
      }}
    >
      <Input type="text" name="email" placeholder="Email" />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
