import { Box, BoxProps, Center, CenterProps } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionCenter = motion<CenterProps>(Center);
const MotionBox = motion<BoxProps>(Box);

export { MotionCenter, MotionBox };
