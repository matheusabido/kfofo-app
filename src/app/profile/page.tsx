"use client"

import Header from "@/components/Header"
import LoadingButton from "@/components/LoadingButton"
import { useAlert } from "@/providers/AlertContext"
import { useAuth } from "@/providers/AuthContext"
import api from "@/utils/api"
import { Box, Flex, Input, Text } from "@chakra-ui/react"
import { AxiosError } from "axios"
import Link from "next/link"
import { useRef, useState } from "react"
import { FaInfoCircle, FaUserAlt } from "react-icons/fa"
import { FaArrowRight, FaArrowRightLong, FaCakeCandles, FaIdCard, FaLock } from "react-icons/fa6"

export default function ProfilePage() {
    const { user, setUser } = useAuth()
    const { addAlert } = useAlert()

    const [loading, setLoading] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const newPasswordRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const birthDateRef = useRef<HTMLInputElement>(null)

    async function handleSave() {
        if (!user) return

        setLoading(true)
        try {
            await api.put(`/user/${user.id}`, {
                name: nameRef.current?.value.trim(),
                email: emailRef.current?.value.trim(),
                password: passwordRef.current?.value.trim(),
                birth_date: birthDateRef.current?.value.trim(),
                new_password: newPasswordRef.current?.value.trim(),
            })
            setUser({
                id: user.id,
                name: nameRef.current?.value.trim() || user?.name,
                email: emailRef.current?.value.trim() || user.email,
                birth_date: birthDateRef.current?.value.trim() || user.birth_date,
                token: user.token,
            })
            addAlert({title: "Sucesso!", text: "Usuário criado com sucesso!", variant: "success"})
        } catch(err) {
            if (err instanceof AxiosError && err.status === 400) {
                addAlert({title: "Erro!", text: err.response?.data.error})
            } else addAlert({title: "Erro!", text: "Não foi possível criar sua conta. Confira seus dados e tente novamente."})
        }
        if (passwordRef.current) passwordRef.current.value = ''
        setLoading(false)
    }

    return <>
        <Header />
        <Box w="90vw" maxW="1600px" m="auto" mt={4}>
            <Text fontSize={20} fontWeight={600}>Olá, {user?.name}!</Text>
            <Text>No seu perfil, você pode ver suas casas, informações e reservas!</Text>
            <Box mt={8}>
                <Flex mb={1} gap={2} align="center">
                    <Text fontWeight={600}>Suas reservas</Text>
                    <FaArrowRightLong />
                </Flex>
                <Flex w="15rem" h="15rem" bgColor="gray.200" rounded="lg" shadow="md" gap={4} p={4} justify="center" align="start" flexDir="column">
                    <Text>Você ainda não fez nenhuma reserva. Que tal fazer uma agora?</Text>
                    <Link href="/">
                        <Flex bgColor="blue.500" color="white" p={2} px={4} rounded="sm" align="center" gap={2} transition="all" _hover={{bgColor: "blue.600"}}>
                            <FaArrowRight />
                            Descobrir
                        </Flex>
                    </Link>
                </Flex>
            </Box>
            <Box mt={8}>
                <Flex mb={1} gap={2} align="center">
                    <Text fontWeight={600}>Suas casas</Text>
                    <FaArrowRightLong />
                </Flex>
                <Flex w="15rem" h="15rem" bgColor="gray.200" rounded="lg" shadow="md" gap={4} p={4} justify="center" align="start" flexDir="column">
                    <Text>Você ainda não cadastrou nenhuma casa. Que tal cadastrar uma agora?</Text>
                    <Link href="/">
                        <Flex bgColor="blue.500" color="white" p={2} px={4} rounded="sm" align="center" gap={2} transition="all" _hover={{bgColor: "blue.600"}}>
                            <FaArrowRight />
                            Cadastrar
                        </Flex>
                    </Link>
                </Flex>
            </Box>
            <Box mt={8} bgColor="gray.100" p={4} rounded="sm" shadow="sm">
                <Flex align="center" gap={2}>
                    <FaInfoCircle />
                    <Text fontWeight={600}>Suas informações</Text>
                </Flex>
                <Flex mt={4} flexDir="column" gap={4}>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaIdCard />
                            <Text>Nome</Text>
                        </Flex>
                        <Input bgColor="white" defaultValue={user?.name} ref={nameRef} p={2} />
                    </Box>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaUserAlt />
                            <Text>E-mail</Text>
                        </Flex>
                        <Input bgColor="white" defaultValue={user?.email} ref={emailRef} p={2} />
                    </Box>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaCakeCandles />
                            <Text>Data de nascimento</Text>
                        </Flex>
                        <Input bgColor="white" type="date" defaultValue={user?.birth_date} ref={birthDateRef} p={2} />
                    </Box>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaLock />
                            <Text>Nova Senha</Text>
                        </Flex>
                        <Input bgColor="white" type="password" ref={newPasswordRef} p={2} />
                    </Box>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaLock />
                            <Text>Senha</Text>
                        </Flex>
                        <Input bgColor="white" type="password" ref={passwordRef} p={2} />
                    </Box>
                    <LoadingButton onClick={handleSave} loading={loading} bgColor="green.500" _hover={{bgColor: "green.600"}}>Salvar</LoadingButton>
                </Flex>
            </Box>
        </Box>
    </>
}