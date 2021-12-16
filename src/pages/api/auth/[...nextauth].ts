import NextAuth from "next-auth";
import FortyTwoProvider, {
  FortyTwoProfile,
} from "next-auth/providers/42-school";
import prisma from "../../../lib/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import staffLogins from "../../../lib/staffLogins";

export interface authUser {
  id: string;
  name: string;
  image: string;
  login: string;
  campus: string;
  isStaff: boolean;
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    FortyTwoProvider<FortyTwoProfile>({
      clientId: process.env.FORTY_TWO_CLIENT_ID,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.usual_full_name,
          email: profile.email,
          image: profile.image_url,
          login: profile.login,
          campus: profile.campus[0].name,
          isStaff: profile["staff?"],
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile: profileWithNoType }) {
      const profile: FortyTwoProfile = profileWithNoType as any;

      const isStaff = staffLogins.some(
        (staffLogin) => profile.login === staffLogin,
      );

      if (isStaff) return true;

      const fromBgOrKH = profile.campus.some(
        (campus) => campus.id === 16 || campus.id === 21,
      );

      if (fromBgOrKH) return true;

      return false;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    async session({ session, user }) {
      const { emailVerified, email, ...newUser } = user;

      session.user = newUser;
      return session;
    },
  },
  pages: {
    error: "/error",
  },
  secret: "1", //tmp
});
