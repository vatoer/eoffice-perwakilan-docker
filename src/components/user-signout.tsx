"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const UserSignout = () => {
  return (
    <div
      onClick={async () => signOut()}
      className="flex items-center gap-x-2 hover:cursor-pointer"
    >
      <LogOut size={16} />
      <span>Sign out</span>
    </div>
  );
};

export default UserSignout;
