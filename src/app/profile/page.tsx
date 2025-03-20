"use client"

import Header from "@/components/Header"
import LoadingButton from "@/components/LoadingButton"
import { useAlert } from "@/providers/AlertContext"
import { useAuth } from "@/providers/AuthContext"
import { Booking, Home, Paginate } from "@/types/api"
import api from "@/utils/api"
import { Box, Button, DialogBackdrop, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogPositioner, DialogRoot, Flex, Input, Portal, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { AxiosError } from "axios"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { FaInfoCircle, FaPlusCircle, FaUserAlt } from "react-icons/fa"
import { FaArrowRight, FaCakeCandles, FaIdCard, FaLock } from "react-icons/fa6"

export default function ProfilePage() {
    const navigation = useRouter()
    const { user, setUser } = useAuth()
    const { addAlert } = useAlert()

    const { data, isError } = useQuery({
		queryKey: ["home", user?.id],
		queryFn: async () => {
			if (!user) return await Promise.reject()
			return (await api.get<Paginate<Home>>(`/homes?user=${user.id}`)).data
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

    const { data: bookings, isError: isErrorBookings, refetch: refetchBookings } = useQuery({
		queryKey: ["booking", user?.id],
		queryFn: async () => {
			if (!user) return await Promise.reject()
			return (await api.get<Booking[]>(`/bookings`)).data
		},
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

    const [loading, setLoading] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const newPasswordRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const birthDateRef = useRef<HTMLInputElement>(null)

    const [loadingDelete, setLoadingDelete] = useState(false)
    const [deleteBooking, setDeleteBooking] = useState<Booking | undefined>(undefined)

    async function handleDelete() {
        if (!user || !deleteBooking) return
        setLoadingDelete(true)
        try {
            await api.delete(`/booking/${deleteBooking.id}`)
            addAlert({ title: "Sucesso!", text: "Reserva cancelada com sucesso!", variant: "success" })
            refetchBookings()
        } catch {
            addAlert({ title: "Erro!", text: "Não foi possível cancelar a reserva." })
        }
        setDeleteBooking(undefined)
        setLoadingDelete(false)
    }

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

    useEffect(() => {
        if (isError || isErrorBookings) addAlert({ title: "Erro!", text: "Não foi possível buscar as informações." })
    }, [addAlert, isError, isErrorBookings])

    return <>
        <DialogRoot open={!!deleteBooking} size="lg">
            <Portal>
                <DialogBackdrop />
                <DialogPositioner mt={4} zIndex={100000000}>
                    <DialogContent p={4}>
                        <DialogHeader>
                            <Text fontWeight={600} fontSize={20}>{deleteBooking?.address}, {deleteBooking?.city}</Text>
                        </DialogHeader>
                        <DialogBody py={4} fontSize={16}>
                            <Text>Deseja mesmo cancelar essa reserva?</Text>
                            <Text mt={1} fontWeight={600}>Não é possível reverter essa ação.</Text>
                        </DialogBody>
                        <DialogFooter>
                            <Button disabled={loadingDelete} onClick={() => setDeleteBooking(undefined)} px={4} variant="outline">Não</Button>
                            <LoadingButton loading={loadingDelete} onClick={handleDelete} px={4} bgColor="red.500" _hover={{bgColor: "red.600"}}>Sim</LoadingButton>
                        </DialogFooter>
                    </DialogContent>
                </DialogPositioner>
            </Portal>
        </DialogRoot>
        <Header />
        <Box w="90vw" maxW="1600px" m="auto" mt={4}>
            <Text fontSize={20} fontWeight={600}>Olá, {user?.name}!</Text>
            <Text>No seu perfil, você pode ver suas casas, informações e reservas!</Text>
            <Box mt={8}>
                <Flex mb={1} gap={2} align="center">
                    <Text fontWeight={600}>Suas reservas</Text>
                </Flex>
                <Flex gap={4} overflowX="auto">
                    {(bookings && !bookings.length) && (
                        <Flex w="15rem" h="15rem" bgColor="gray.200" rounded="lg" shadow="md" gap={4} p={4} justify="center" align="start" flexDir="column">
                            <Text color="gray.800">Você ainda não fez nenhuma reserva. Que tal fazer uma agora?</Text>
                            <Link href="/">
                                <Flex bgColor="blue.500" color="white" p={2} px={4} rounded="sm" align="center" gap={2} transition="all" _hover={{bgColor: "blue.600"}}>
                                    <FaArrowRight />
                                    Descobrir
                                </Flex>
                            </Link>
                        </Flex>
                    )}
                    {bookings?.map((c) => (
                        <Flex key={c.id} w="15rem" bgColor="white" rounded="lg" shadow="md" gap={4} justify="center" align="start" flexDir="column">
                            <Image style={{width: "100%", height: "80%", objectFit: "cover", borderRadius: "inherit"}} width={400} height={400} src={`${process.env.NEXT_PUBLIC_API_URL}/home/picture?path=${encodeURIComponent(c.picture_path)}`} alt="Home picture" />
                            <Flex w="100%" p={2} flexDir="column" gap={2}>
                                <Text>{c.from_date.split('-').reverse().join('/')} - {c.to_date.split('-').reverse().join('/')}</Text>
                                <Text style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{c.address}, {c.city}</Text>
                                <Button onClick={() => navigation.push(`/home?id=${c.home_id}`)} px={4} bgColor="blue.500" _hover={{bgColor: "blue.600"}}>Detalhes</Button>
                                <Button onClick={() => setDeleteBooking(c)} px={4} bgColor="red.500" _hover={{bgColor: "red.600"}}>Cancelar</Button>
                            </Flex>
                        </Flex>
                    ))}
                </Flex>
            </Box>
            <Box mt={8}>
                <Flex mb={1} gap={2} align="center">
                    <Text fontWeight={600}>Suas casas</Text>
                    <FaPlusCircle onClick={() => navigation.push("/home/cadastrar")} cursor="pointer" color="#00aa00" />
                </Flex>
                <Flex gap={4} overflowX="auto">
                    {(data && !data.data?.length) && (
                        <Flex w="15rem" h="15rem" bgColor="gray.200" rounded="lg" shadow="md" gap={4} p={4} justify="center" align="start" flexDir="column">
                            <Text color="gray.800">Você ainda não cadastrou nenhuma casa. Que tal cadastrar uma agora?</Text>
                            <Link href="/">
                                <Flex bgColor="blue.500" color="white" p={2} px={4} rounded="sm" align="center" gap={2} transition="all" _hover={{bgColor: "blue.600"}}>
                                    <FaArrowRight />
                                    Cadastrar
                                </Flex>
                            </Link>
                        </Flex>
                    )}
                    {data?.data.map((c) =>
                        <Flex key={c.id} w="15rem" bgColor="white" rounded="lg" shadow="md" gap={4} justify="center" align="start" flexDir="column">
                            <Image style={{width: "100%", height: "80%", objectFit: "cover", borderRadius: "inherit"}} width={400} height={400} src={`${process.env.NEXT_PUBLIC_API_URL}/home/picture?path=${encodeURIComponent(c.picture_path)}`} alt="Home picture" />
                            <Flex w="100%" p={2} flexDir="column" gap={2}>
                                <Text style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{c.address}, {c.city}</Text>
                                <Button onClick={() => navigation.push(`/home?id=${c.id}`)} px={4} bgColor="blue.500" _hover={{bgColor: "blue.600"}}>Detalhes</Button>
                            </Flex>
                        </Flex>
                    )}
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
                        <Input readOnly bgColor="white" defaultValue={user?.email} ref={emailRef} p={2} />
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