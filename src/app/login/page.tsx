"use client"

import Header from "@/components/Header"
import LoadingButton from "@/components/LoadingButton"
import { useAlert } from "@/providers/AlertContext"
import { useAuth } from "@/providers/AuthContext"
import { User } from "@/types/api"
import api from "@/utils/api"
import { Box, Flex, Input, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { FaUserAlt } from "react-icons/fa"
import { FaLock } from "react-icons/fa6"

export default function LoginPage() {
    const navigation = useRouter()
    const { setUser } = useAuth()
    const { addAlert } = useAlert()

    const [loading, setLoading] = useState(false)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    async function handleLogin() {
        setLoading(true)
        try {
            const { data } = await api.post<User>("/session", {
                email: emailRef.current?.value.trim(),
                password: passwordRef.current?.value.trim(),
            })
            setUser(data)
            addAlert({title: "Sucesso!", text: "Logado com sucesso!", variant: "success"})
            navigation.replace("/")
        } catch {
            addAlert({title: "Erro!", text: "Não foi possível fazer login. Confira seus dados e tente novamente."})
            setLoading(false)
        }
    }

    return <>
        <Header />
        <Flex align="center" justify="center" flex={1}>
            <Flex gap={4} flexDir="column" w="90vw" maxW="300px">
                <Box>
                    <Flex align="center" gap={2}>
                        <FaUserAlt />
                        <Text>E-mail</Text>
                    </Flex>
                    <Input ref={emailRef} p={2} />
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaLock />
                        <Text>Senha</Text>
                    </Flex>
                    <Input type="password" ref={passwordRef} p={2} />
                </Box>
                <LoadingButton onClick={handleLogin} loading={loading} bgColor="blue.500" color="white" _hover={{bgColor: "blue.600"}}>Entrar</LoadingButton>
            </Flex>
        </Flex>
    </>
}