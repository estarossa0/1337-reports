import { Center, Stack } from "@chakra-ui/react";
import SubmitControl from "../components/submit/submit-control";
import EditorProvider from "../components/submit/editor-provider";
import SubmitForm from "../components/submit/submit-form";
import SubmitBox from "../components/submit/submit-box";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Submit = () => {
  return (
    <Center top="40px" pos="relative">
      <EditorProvider>
        <SubmitForm>
          <Stack
            align={{ base: "center", lg: undefined }}
            spacing="4"
            direction={{ base: "column", lg: "row" }}
          >
            <SubmitBox />
            <SubmitControl />
          </Stack>
        </SubmitForm>
      </EditorProvider>
    </Center>
  );
};

const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session)
    return { redirect: { destination: "/login", permanent: false } };
  return { props: {} };
};

export { Submit as default, getServerSideProps };
