import { Box, Button } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { authUser } from "../pages/api/auth/[...nextauth]";
import { useRouter } from "next/router";

const SubmitButton = () => {
  const session = useSession();
  const user = session.data?.user as authUser;
  const { pathname } = useRouter();

  const noSubmit = !user || user.isStaff || pathname === "/submit";

  return (
    <Box>
      <Link href="/submit" passHref>
        <Button
          display={noSubmit ? "none" : undefined}
          as="a"
          _active={{ transform: "scale(0.9)" }}
          right="5%"
          m="3"
          bg="black"
          color="white"
          position="absolute"
        >
          New submit +
        </Button>
      </Link>
    </Box>
  );
};

export { SubmitButton as default };
