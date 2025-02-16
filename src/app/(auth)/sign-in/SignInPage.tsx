import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SocialButton } from "../(oauth)/_components/SocialButton";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  return (
    <div className="md:p-8">
      <h2 className="text-2xl md:text-center">
        Welcome Back to <span className="font-bold text-primary">Invoicio</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground md:text-center">
        Sign in to continue. You can also sign in with Google or Facebook.
      </p>

      <SignInForm />

      <div className="relative flex items-center">
        <div className="flex-1 h-px bg-border"></div>
        <span className="px-3 text-sm font-medium text-muted-foreground">
          OR
        </span>
        <div className="flex-1 h-px bg-border"></div>
      </div>

      <div className="flex flex-col items-center justify-between mt-6 space-y-3 md:flex-row md:space-y-0 md:space-x-3">
        <SocialButton provider="google" type="sign-in" />
        <SocialButton provider="facebook" type="sign-in" />
      </div>

      <div className="mt-6 text-center">
        <Button asChild className="w-full">
          <Link href="/magic-link">Sign in with Magic Link</Link>
        </Button>
      </div>

      <Separator className="my-6" />

      <p className="text-sm text-center text-muted-foreground">
        Don’t have an account?{" "}
        <Button asChild variant="link" className="px-0">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </p>

      <div className="mt-6 text-center">
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
