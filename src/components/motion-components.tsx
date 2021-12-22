import {
  Box,
  BoxProps,
  Center,
  CenterProps,
  Container,
  ContainerProps,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionCenter = motion<CenterProps>(Center);
const MotionBox = motion<BoxProps>(Box);
const MotionContainer = motion<ContainerProps>(Container);

export { MotionCenter, MotionBox, MotionContainer };
