import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const useLoggedSession = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") router.push("/login");
  return session;
};

export { useLoggedSession };
