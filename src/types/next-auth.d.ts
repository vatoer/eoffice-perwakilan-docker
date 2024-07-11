import { DefaultSession } from "next-auth";

// nextauth.d.ts

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    name: string;
    nama_lengkap: string;
    randomkey?: string;
    role?: Role;
    user_kd: number;
    fungsi_kd: number;
    permissions: string[];
  }
  interface Session {
    user: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    nama_lengkap: string;
    name: string;
    perwakilan?: string;
    role?: string;
    user_kd: number;
    fungsi_kd: number;
    permissions: string[];
  }
}
