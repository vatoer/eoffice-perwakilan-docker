import { UncomplexLoginSchema } from "@auth/_zodschema/login";
import { extractPermissions, getAdminPermissions } from "@/data/permission";
import { createHash, randomBytes } from "crypto";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUser } from "./_data/user";

export default {
  trustHost: true,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        //console.log("credentials", credentials);
        const validatedCredentials =
          UncomplexLoginSchema.safeParse(credentials);

        if (validatedCredentials.success) {
          const { username, password } = validatedCredentials.data;
          const user = await getUser(username);

          if (!user || !user.password) {
            return null;
          }

          // console.log("user", user);

          //const isPasswordMatch = await bcrypt.compare(password, user.password);

          const isPasswordMatch = compareMD5Hash(password, user.password);

          if (!isPasswordMatch) {
            return null;
          }

          const randomKey = randomBytes(32).toString("hex");

          //return user;
          // model user yang diharapkan oleh next-auth lihat referensi di bawah
          // https://authjs.dev/getting-started/adapters/prisma
          // kemudian sesuaikan dengan model user yang ada di aplikasi dengan memodifikasi next-auth.d.ts
          // disini permisssions kita definisikan sebagai array string
          // permission ini kita akan build dari user yg di dapat dari getUser
          let permissions: string[] = [];

          // hardcoded permission
          if (user.fungsi_kd === 2) {
            permissions = await getAdminPermissions();
            user.role = "admin";
            console.log("[AUTH CONFIG] admin permission", permissions);
          } else {
            permissions = await extractPermissions(user);
          }

          //console.log("[AUTH CONFIG] permission", permissions);

          return {
            ...user,
            //perwakilan: "perwakilan", // bagaimana cara mendapatkan perwakilan dari user?
            randomKey: randomKey,
            permissions,
            //role: "user", // bagaimana cara mendapatkan role dari user?
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!user || !account) {
        throw new Error("Invalid sign in");
      }

      //console.log("[signIn] user", user);
      return true;
    },
    async session({ session, token }) {
      //console.log("session", session);
      //console.log("token", token);
      session.user.id = token.sub as string;
      //session.user.randomkey = token.randomKey as string;
      session.user.role = token.role as string;
      session.user.fungsi_kd = token.fungsi_kd as number;
      session.user.user_kd = token.user_kd as number;
      session.user.name = token.name as string;
      session.user.nama_lengkap = token.nama_lengkap as string;
      session.user.permissions = token.permissions as string[];
      //console.log("session", session);
      return session;
    },
    async jwt({ token, user, account, profile }) {
      //console.log("[jwt] token", token);
      //console.log("[jwt] account", account);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.nama_lengkap = user.nama_lengkap;
        token.role = user.role;
        token.fungsi_kd = user.fungsi_kd;
        token.user_kd = user.user_kd;
        token.permissions = user.permissions;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

// Function to compare an MD5 hash
function compareMD5Hash(data: string, hash: string) {
  // Create a hash object
  const check = createHash("md5");

  // Update the hash with the data
  check.update(data);

  const digest = check.digest("hex");

  //console.log("check.digest('hex')", digest);
  //console.log("hash", hash);

  // Get the hexadecimal representation of the hash
  return digest === hash;
}
