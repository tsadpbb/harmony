import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your address
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
