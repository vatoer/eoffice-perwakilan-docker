import { auth } from "@/app/(auth)/auth";
import { SessionProvider, useSession } from "next-auth/react";

export interface IAuthContextProviderProps {
  children: React.ReactNode;
}

export default async function AuthContextProvider({
  children,
}: IAuthContextProviderProps) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <>{children}</>
    </SessionProvider>
  );
}
