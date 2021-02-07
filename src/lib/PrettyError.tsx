import React, { FC, ReactNode } from "react";
import { Badge } from "@chakra-ui/react";

export const PrettifyError: FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <Badge colorScheme="red" mr="2">
      Oops!
    </Badge>
    {children}
  </>
);
export default PrettifyError;
