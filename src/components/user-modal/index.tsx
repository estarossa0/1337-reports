import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { createContext } from "react";
import { RiListSettingsLine } from "react-icons/ri";
import SignBody from "./modal-body";

const UserContext = createContext(undefined);

const ModalContainer = ({ isOpen, onClose }) => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <Modal size="xs" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <UserContext.Provider value={user}>
            <SignBody />
          </UserContext.Provider>
        </ModalBody>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
};

const UserModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <ModalContainer isOpen={isOpen} onClose={onClose} />
      <IconButton
        pos="absolute"
        right="0%"
        size="lg"
        aria-label="tool-kit"
        icon={<RiListSettingsLine />}
        onClick={onOpen}
      />
    </>
  );
};

export { UserModal as default, UserContext };
