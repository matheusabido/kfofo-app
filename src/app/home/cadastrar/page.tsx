"use client"

import Header from "@/components/Header"
import LoadingButton from "@/components/LoadingButton"
import { useAlert } from "@/providers/AlertContext"
import { useAuth } from "@/providers/AuthContext"
import { Home } from "@/types/api"
import api from "@/utils/api"
import { Box, Button, CheckboxControl, CheckboxHiddenInput, CheckboxLabel, CheckboxRoot, FileUpload, Flex, Input, NativeSelectField, NativeSelectRoot, Text, Textarea } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { FaCamera, FaCity, FaComment, FaLocationDot, FaMoneyBill, FaPeopleGroup, FaUtensils } from "react-icons/fa6"
import { HiUpload } from "react-icons/hi"
import { MdBlock } from "react-icons/md"

const utensils = ['Cama', 'Roupa de Cama', 'Louça', 'Climatização', 'Lava-louças', 'Máquina de lavar']

export default function CadastrarHome() {
    const navigation = useRouter()
    const { addAlert } = useAlert()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [selectedUtensils, setUtensils] = useState<{[key: number]: boolean}>({})

    const addressRef = useRef<HTMLInputElement>(null)
    const cityRef = useRef<HTMLInputElement>(null)
    const descriptionRef = useRef<HTMLTextAreaElement>(null)
    const diariaRef = useRef<HTMLInputElement>(null)
    const restrictionRef = useRef<HTMLSelectElement>(null)
    const shareRef = useRef<HTMLSelectElement>(null)
    const photoRef = useRef<HTMLInputElement>(null)

    async function handleCreate() {
        if (!user) return
        if (!photoRef.current?.files || !photoRef.current?.files.length) {
            addAlert({ title: "Erro!", text: "A foto é obrigatória." })
            return
        }
        setLoading(true)
        try {
            const { data } = await api.post<Home>("/home", {
                user_id: user.id,
                address: addressRef.current?.value.trim(),
                city: cityRef.current?.value.trim(),
                description: descriptionRef.current?.value.trim(),
                cost_day: parseFloat(diariaRef.current?.value || '0'),
                restriction_id: parseInt(restrictionRef.current?.value || "0"),
                share_type_id: parseInt(shareRef.current?.value || "0"),
            })
            
            const form = new FormData()
            form.append('home_id', `${data.id}`)
            form.append('file', photoRef.current?.files[0])
            
            const picturePromise = api.post("/home/picture", form)
            const utensilsPromise = api.put("/utensils", {
                home_id: data.id,
                utensil_ids: Object.entries(selectedUtensils).filter((a) => a[1]).map((a) => parseInt(a[0]))
            })

            await Promise.all([picturePromise, utensilsPromise])

            addAlert({ title: "Sucesso!", text: "Casa cadastrada com sucesso!", variant: "success" })
            navigation.replace("/profile")
        } catch(err) {
            console.log(err)
            addAlert({ title: "Erro!", text: "Não foi possível cadastrar a casa! Configura seus dados e tente novamente." })
            setLoading(false)
        }
    }

    function handleUtensil(id: number, active: boolean) {
        const u = {...selectedUtensils}
        u[id] = active
        setUtensils(u)
    }

    return <>
        <Header />
        <Flex justify="center" align="center" flex={1}>
            <Flex gap={4} flexDir="column" w="90vw" maxW="300px">
                <Box>
                    <Flex align="center" gap={2}>
                        <FaLocationDot />
                        <Text>Endereço</Text>
                    </Flex>
                    <Input ref={addressRef} p={2} />
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaCity />
                        <Text>Cidade</Text>
                    </Flex>
                    <Input ref={cityRef} p={2} />
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaComment />
                        <Text>Descrição</Text>
                    </Flex>
                    <Textarea ref={descriptionRef} p={2} />
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaMoneyBill />
                        <Text>Diária</Text>
                    </Flex>
                    <Input ref={diariaRef} type="number" p={2} />
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <MdBlock />
                        <Text>Restrição</Text>
                    </Flex>
                    <NativeSelectRoot>
                        <NativeSelectField ref={restrictionRef} p={2}>
                            <option value="1">Estudante</option>
                            <option value="2">Trabalhador</option>
                            <option value="3">Estudante/Trabalhador</option>
                            <option value="4" selected>Nenhuma</option>
                        </NativeSelectField>
                    </NativeSelectRoot>
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaPeopleGroup />
                        <Text>Compartilhamento</Text>
                    </Flex>
                    <NativeSelectRoot>
                        <NativeSelectField ref={shareRef} p={2}>
                            <option value="1" selected>Família</option>
                            <option value="2">Compartilhamento Misto</option>
                            <option value="3">Compartilhamento Homem</option>
                            <option value="4">Compartilhamento Mulher</option>
                        </NativeSelectField>
                    </NativeSelectRoot>
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaCamera />
                        <Text>Foto</Text>
                    </Flex>
                    <FileUpload.Root>
                        <FileUpload.HiddenInput ref={photoRef} />
                            <FileUpload.Trigger w="100%" asChild>
                                <Button variant="outline" size="sm">
                                    <HiUpload />
                                </Button>
                            </FileUpload.Trigger>
                        <FileUpload.List />
                    </FileUpload.Root>
                </Box>
                <Box>
                    <Flex align="center" gap={2}>
                        <FaUtensils />
                        <Text>Utensílios</Text>
                    </Flex>
                    <Flex flexWrap="wrap" gap={2}>
                        {utensils.map((u, i) => <CheckboxRoot key={`u${i+1}`}>
                            <CheckboxHiddenInput onInput={(e) => handleUtensil(i+1, e.currentTarget.checked)} />
                            <CheckboxControl _checked={{bgColor: "blue.500"}} />
                            <CheckboxLabel>{u}</CheckboxLabel>
                        </CheckboxRoot>)}
                    </Flex>
                </Box>
                <LoadingButton onClick={handleCreate} loading={loading} bgColor="blue.500" color="white" _hover={{bgColor: "blue.600"}}>Cadastrar</LoadingButton>
            </Flex>
        </Flex>
    </>
}