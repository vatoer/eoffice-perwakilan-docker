"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface IButtonWithGoogleProps {
  callbackUrl?: string;
}

export const ButtonWithGoogle = ({
  callbackUrl = "/",
}: IButtonWithGoogleProps) => {
  const handleLoginWithGoogle = () => {
    signIn("google", { callbackUrl });
  };
  return (
    <Button
      type="button"
      onClick={handleLoginWithGoogle}
      variant={"outline"}
      className="flex justify-center items-center gap-x-2"
    >
      <Image
        src="/images/google-icon.svg"
        alt="login with Google"
        width={24}
        height={24}
        className="mr-2 pr-2"
      />
      <span className="text-slate-600">Continue with Google</span>
    </Button>
  );
};
