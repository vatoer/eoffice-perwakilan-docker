"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const ButtonSignout = () => {
  return (
    <div>
      <Button variant={"outline"} onClick={() => signOut()}>
        Signout
      </Button>
    </div>
  );
};

export default ButtonSignout;
