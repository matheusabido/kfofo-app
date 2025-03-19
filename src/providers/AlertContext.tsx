"use client"

import { Box, Flex, Text } from "@chakra-ui/react"
import { createContext, ReactNode, useContext, useState } from "react"
import { FaX } from "react-icons/fa6"

type Alert = {
    title: string
    text: string
    variant?: 'success' | 'error'
}

type Alerts = {
    alerts: Alert[]
    addAlert: (alert: Alert) => void
}

const AlertContext = createContext<Alerts>({addAlert: () => {}, alerts: []})

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<Alert[]>([])

    function addAlert(alert: Alert) {
        const newAlerts = [...alerts]
        newAlerts.push(alert)
        setAlerts(newAlerts)
    }

    function handleClose(index: number) {
        return () => {
            const newAlerts = [...alerts]
            newAlerts.splice(index, 1)
            setAlerts(newAlerts)
        }
    }

    return <AlertContext.Provider value={{ alerts, addAlert }}>
        <Flex pos="fixed" alignSelf="center" top={4} zIndex={1000000} flexDir="column" gap={2}>
            {alerts.map((alert, i) => <Box w="90vw" maxW="500px" bgColor={alert.variant === 'success' ? "green.500" : "red.500"} p={2} px={4} rounded="sm" key={`alert-${i}`}>
                <Flex w="100%">
                    <Flex flexDir="column" flex={1}>
                        <Text color="white" fontWeight={600}>{alert.title}</Text>
                        <Text color="white">{alert.text}</Text>
                    </Flex>
                    <Flex align="center">
                        <FaX color="white" cursor="pointer" onClick={handleClose(i)} />
                    </Flex>
                </Flex>
            </Box>)}
        </Flex>
        {children}
    </AlertContext.Provider>
}

export function useAlert() {
    const alert = useContext(AlertContext)
    return alert
}