import NextAuth from "next-auth";
import FortyTwoProvider, {
  FortyTwoProfile,
} from "next-auth/providers/42-school";
import prisma from "../../../lib/prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

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
        };
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  pages: {
    error: "/error",
  },
  secret: "1", //tmp
});
