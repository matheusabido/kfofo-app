"use client"

import { useAuth } from "@/providers/AuthContext"
import { Box, Flex, Text } from "@chakra-ui/react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
    const { user } = useAuth()

    return <Box as={"header"} p={2} bgColor="blue.500">
        <Flex w="90vw" maxW="1600px" m="auto" justify="space-between" alignItems="center">
            <Link href="/">
                <Flex alignItems="end" gap={1}>
                    <Image style={{filter: "invert()"}} src="/kfofo-logo.png" width={24} height={24} alt="Kfofo logo" />
                    <Text color="white" fontSize={24} fontWeight={600} mb={-2}>fofo</Text>
                </Flex>
            </Link>
            <Flex gap={4} color="white" alignItems="center">
                <Link href="/">Descobrir</Link>
                {user
                ?
                    <Link href="/profile">
                        <Box border="1px solid white" p={2} px={4} rounded="md" transition="all" _hover={{bgColor: "white", color: "black"}}>Seu Perfil</Box>
                    </Link>
                : <>
                    <Link href="/registrar">
                        <Box border="1px solid white" p={2} px={4} rounded="md" transition="all" _hover={{bgColor: "white", color: "black"}}>Registrar-se</Box>
                    </Link>
                    <Link href="/login">
                        <Box p={2} px={4} bgColor="white" color="black" rounded="md" transition="all" _hover={{bgColor: "gray.200"}}>Login</Box>
                    </Link>
                </>}
            </Flex>
        </Flex>
    </Box>
}