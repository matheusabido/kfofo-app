"use client"

import Header from "@/components/Header"
import LoadingButton from "@/components/LoadingButton"
import { useAlert } from "@/providers/AlertContext"
import { useAuth } from "@/providers/AuthContext"
import api from "@/utils/api"
import { Box, Flex, Input, Spinner, Text } from "@chakra-ui/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useRef, useState } from "react"
import { FaCalendarAlt } from "react-icons/fa"

export default function CadastrarBooking() {
    return <Suspense fallback={<Flex justify="center" mt={4}><Spinner color="blue" /></Flex>}>
        <Page />
    </Suspense>
}

function Page() {
    const navigation = useRouter()
    const { addAlert } = useAlert()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const params = useSearchParams()
    const homeId = parseInt(params.get("id") || "")

    useEffect(() => {
        if (!homeId) navigation.replace("/")
    }, [homeId, navigation])

    const fromDateRef = useRef<HTMLInputElement>(null)
    const toDateRef = useRef<HTMLInputElement>(null)

    async function handleCreateBooking() {
        if (!user || !homeId) return

        if (!fromDateRef.current?.value) {
            addAlert({ title: "Erro!", text: "A data de início é obrigatória." })
            return
        }
        if (!toDateRef.current?.value) {
            addAlert({ title: "Erro!", text: "A data de fim é obrigatória." })
            return
        }

        setLoading(true)
        try {
            await api.post("/booking", {
                home_id: homeId,
                from_date: fromDateRef.current.value,
                to_date: toDateRef.current.value,
            })

            addAlert({ title: "Sucesso!", text: "Reserva cadastrada com sucesso!", variant: "success" })
            navigation.replace("/profile")
        } catch (err) {
            console.error(err)
            addAlert({ title: "Erro!", text: "Não foi possível cadastrar a reserva. Verifique seus dados e tente novamente." })
            setLoading(false)
        }
    }

    return (
        <>
            <Header />
            <Flex justify="center" align="center" flex={1}>
                <Flex gap={4} flexDir="column" w="90vw" maxW="300px">
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaCalendarAlt />
                            <Text>Data de Início</Text>
                        </Flex>
                        <Input ref={fromDateRef} p={2} type="date" />
                    </Box>
                    <Box>
                        <Flex align="center" gap={2}>
                            <FaCalendarAlt />
                            <Text>Data de Fim</Text>
                        </Flex>
                        <Input ref={toDateRef} p={2} type="date" />
                    </Box>
                    <LoadingButton onClick={handleCreateBooking} loading={loading} bgColor="blue.500" color="white" _hover={{ bgColor: "blue.600" }}>
                        Reservar
                    </LoadingButton>
                </Flex>
            </Flex>
        </>
    )
}
