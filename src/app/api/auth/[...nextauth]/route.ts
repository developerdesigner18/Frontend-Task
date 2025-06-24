import { CONFIG } from "@/config";
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Extend NextAuth types to include 'id' and 'accessToken'
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
  }
  interface User {
    id: string;
    accessToken: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
  }
}



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
