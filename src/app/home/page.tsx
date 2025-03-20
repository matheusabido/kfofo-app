"use client"

import Header from "@/components/Header"
import { Home } from "@/types/api"
import api from "@/utils/api"
import { Flex, Spinner } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

export default function HomePage() {
    return <Suspense fallback={<Flex justify="center" mt={4}><Spinner color="blue" /></Flex>}>
			<Page />
    </Suspense>
}

function Page() {
	const navigation = useRouter()
	const params = useSearchParams()
	const id = parseInt(params.get("id") || "")

	const { data, isFetching, isError } = useQuery({
		queryKey: ["home"],
		queryFn: async () => {
			if (!id) return await Promise.reject()
			return (await api.get<Home>(`/home/${id}`)).data
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

	console.log(data)
	return <>
		<Header />
	</>
}