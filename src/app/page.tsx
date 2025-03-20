"use client"

import Header from "@/components/Header";
import { Tooltip } from "@/components/ui/tooltip";
import { useAlert } from "@/providers/AlertContext";
import { Home, Paginate } from "@/types/api";
import api from "@/utils/api";
import { Badge, Button, CardBody, CardFooter, CardRoot, Flex, GridItem, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight, FaCity, FaPeopleGroup } from "react-icons/fa6";
import { MdBlock } from "react-icons/md";

export default function MainPage() {
  const navigation = useRouter()
  const { addAlert } = useAlert()
  const [page, setPage] = useState(1)

  const { data, isFetching, isError } = useQuery({
    queryKey: ["homes", page],
    queryFn: async () => (await api.get<Paginate<Home>>("/homes", { params: { page } })).data,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (isError) addAlert({ title: "Erro!", text: "Não foi possível buscar as casas." })
  }, [addAlert, isError])

  return <>
    <Header />
    <Flex justify="center" align="center" gap={2} mt={4}>
      <Button disabled={isFetching || page <= 1} onClick={() => setPage(page - 1)} size="sm" bgColor="blue.500" _hover={{bgColor: "blue.600"}} transition="all"><FaAngleLeft /></Button>
      <Text>{page}/{data?.lastPage || 1}</Text>
      <Button disabled={isFetching || page >= (data?.lastPage || -1)} onClick={() => setPage(page + 1)} size="sm" bgColor="blue.500" _hover={{bgColor: "blue.600"}} transition="all"><FaAngleRight /></Button>
    </Flex>
    <SimpleGrid w="90vw" maxW="1600px" m="0 auto" gap={4} columns={{ base: 1, md: 2, lg: 3, xl: 4 }} p={4}>
      {(data && !isFetching && !isError)
      ? data.data?.map((c) =>
        <GridItem key={c.id}>
          <CardRoot m="0 auto" h="100%" maxW="md" overflow="hidden">
            <Image style={{width: "100%", height: "20rem", objectFit: "cover"}} width={500} height={500} src={`${process.env.NEXT_PUBLIC_API_URL}/home/picture?path=${encodeURIComponent(c.picture_path)}`} alt="Home picture" />
            <CardBody p={2}>
              <Flex align="center">
                <Text flex={1} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight="bold">{c.address}</Text>
                <Badge size="lg" color="white" p={2} bgColor="green.500">R$ {c.cost_day}</Badge>
              </Flex>
              <Flex flexDir="column" gap={2}>
                <Text color="gray.700">{c.address}</Text>
                <SimpleGrid columns={{base: 2}}>
                  <GridItem display="flex" alignItems="center" gap={2}>
                    <FaCity />
                    <Text>{c.city}</Text>
                  </GridItem>
                  <GridItem display="flex" alignItems="center" gap={2}>
                    <FaUserAlt />
                    <Text>{c.user_name}</Text>
                  </GridItem>
                  <GridItem display="flex" alignItems="center" gap={2}>
                    <MdBlock />
                    <Tooltip content={c.restriction_description} positioning={{offset: {mainAxis: 0}}} openDelay={0} closeDelay={0}>
                      <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{c.restriction_name}</Text>
                    </Tooltip>
                  </GridItem>
                  <GridItem display="flex" alignItems="center" gap={2}>
                    <FaPeopleGroup />
                    <Tooltip content={c.share_type_description} positioning={{offset: {mainAxis: 0}}} openDelay={0} closeDelay={0}>
                      <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{c.share_type_name}</Text>
                    </Tooltip>
                  </GridItem>
                </SimpleGrid>
              </Flex>
            </CardBody>
            <CardFooter p={2} justifyContent="end">
              <Button onClick={() => navigation.push(`/home?id=${c.id}`)} px={4} bgColor="blue.500" transition="all" _hover={{bgColor: "blue.600"}}>Detalhes</Button>
            </CardFooter>
          </CardRoot>
        </GridItem>
      )
      : <Skeleton h="20rem" />}
    </SimpleGrid>
  </>
}
