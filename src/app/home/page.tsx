"use client"

import Header from "@/components/Header"
import { Home, Utensil } from "@/types/api"
import api from "@/utils/api"
import { Badge, Box, Button, Flex, Skeleton, Spinner, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { FaCheck, FaLocationDot, FaPeopleGroup, FaUtensils } from "react-icons/fa6"
import styles from "./page.module.css"
import { Tooltip } from "@/components/ui/tooltip"
import { MdBlock } from "react-icons/md"
import { FaUserAlt } from "react-icons/fa"
import { useAlert } from "@/providers/AlertContext"

export default function HomePage() {
    return <Suspense fallback={<Flex justify="center" mt={4}><Spinner color="blue" /></Flex>}>
			<Page />
    </Suspense>
}

function Page() {
	const navigation = useRouter()
	const { addAlert } = useAlert()
	const params = useSearchParams()
	const id = parseInt(params.get("id") || "")

	const { data, isError } = useQuery({
		queryKey: ["home", id],
		queryFn: async () => {
			if (!id) return await Promise.reject()
			return (await api.get<Home>(`/home/${id}`)).data
		},
		staleTime: 5 * 60 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

	const { data: utensils, isError: isErrorUtensils } = useQuery({
		queryKey: ["home-utensils", id],
		queryFn: async () => {
			if (!id) return await Promise.reject()
			return (await api.get<Utensil[]>(`/utensils?home_id=${id}`)).data
		},
		staleTime: 5 * 60 * 1000,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		if (!id) {
			navigation.replace("/")
			return
		}
	}, [id, navigation])

	useEffect(() => {
		if (isError || isErrorUtensils) addAlert({ title: "Erro!", text: "Não foi possível buscar as informações." })
	}, [addAlert, isError, isErrorUtensils])

	return <>
		<Header />
		<Flex className={styles.info} gap={4} w="90vw" maxWidth="1600px" m="1rem auto">
			<Box>
				<Box shadow="md" rounded="lg" w="90vw" maxW="400px">
					{data 
						? <Image style={{width: "100%", objectFit: "cover", borderRadius: "inherit"}} width={400} height={400} src={`${process.env.NEXT_PUBLIC_API_URL}/home/picture?path=${encodeURIComponent(data.picture_path)}`} alt="Home picture" />
						: <Skeleton height="10rem" />}
				</Box>
				<Flex justify="space-between" align="center" mt={4}>
					<Flex gap={2} alignItems="center">
						<FaLocationDot />
						<Text fontWeight={500}>{data?.address}, {data?.city}</Text>
					</Flex>
					<Badge size="lg" bgColor="green.500" color="white" p={2} px={4}>R$ {data?.cost_day}</Badge>
				</Flex>
			</Box>
			<Flex shadow="lg" flex={1} p={4} w="100%" flexDir="column" justify="space-between" align="end">
				<Box w="100%">
					<Text fontWeight={600}>Descrição</Text>
					<Text>{data?.description}</Text>
					<Flex display="flex" alignItems="center" gap={2} mt={8}>
						<FaUserAlt />
						<Text>Casa de {data?.user_name}</Text>
					</Flex>
					<Flex display="flex" alignItems="center" gap={2}>
						<MdBlock />
						<Tooltip content={data?.restriction_description} positioning={{offset: {mainAxis: 0}}} openDelay={0} closeDelay={0}>
							<Text>Restrição: {data?.restriction_name}</Text>
						</Tooltip>
					</Flex>
					<Flex display="flex" alignItems="center" gap={2}>
						<FaPeopleGroup />
						<Tooltip content={data?.share_type_description} positioning={{offset: {mainAxis: 0}}} openDelay={0} closeDelay={0}>
							<Text>Tipo: {data?.share_type_name}</Text>
						</Tooltip>
					</Flex>
					<Flex gap={2} align="center" mt={8} mb={2}>
						<FaUtensils />
						<Text>Utensílios</Text>
					</Flex>
					<Flex gap={2}>
						{utensils?.map((c) => <Badge color="white" p={2} px={4} bgColor="blue.500" key={`ut-${c.id}`}>{c.name}</Badge>)}
					</Flex>
				</Box>
				<Button bgColor="blue.500" _hover={{bgColor: "blue.600"}} px={4}><FaCheck /> Reservar</Button>
			</Flex>
		</Flex>
	</>
}