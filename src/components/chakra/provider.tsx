"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ReactNode } from "react"

export function Provider(props: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      {props.children}
    </ChakraProvider>
  )
}
