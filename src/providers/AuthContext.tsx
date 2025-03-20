"use client"

import { User } from "@/types/api"
import api from "@/utils/api"
import { Flex, Spinner } from "@chakra-ui/react"
import { usePathname, useRouter } from "next/navigation"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"

type Auth = {
    user?: User
    setUser: (user: User) => void
}

const AuthContext = createContext<Auth>({setUser: () => {}})

const PROTECTED_ROUTES = [
    '/profile',
    '/home/cadastrar',
]

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigation = useRouter()
    const path = usePathname()
    const [user, setUser] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = api.interceptors.response.use((r) => {
            if (r.status === 401) {
                setAndUpdateUser(undefined)
                return Promise.reject()
            }
            return r
        })

        return () => api.interceptors.response.eject(id)
    }, [])

    useEffect(() => {
        const item = localStorage.getItem("kfofo-user")
        if (item) setAndUpdateUser(JSON.parse(item))
        setLoading(false)
    }, [])

    useEffect(() => {
        if (!loading && path && !user) {
            if (PROTECTED_ROUTES.some((r) => path.includes(r))) navigation.push('/')
        }
    }, [loading, navigation, path, user])

    function setAndUpdateUser(user?: User) {
        if (user) localStorage.setItem("kfofo-user", JSON.stringify(user))
        else localStorage.removeItem("kfofo-user")
        
        setUser(user)
        
        api.interceptors.request.clear()
        if (user?.token) api.interceptors.request.use((r) => {
            r.headers["Authorization"] = `Bearer ${user.token}`
            return r
        })
    }

    return <AuthContext.Provider value={{ user, setUser: setAndUpdateUser }}>
        {loading ? <Flex flex={1} justify="center" align="center"><Spinner color="blue" size="lg" /></Flex> : children}
    </AuthContext.Provider>
}

export function useAuth() {
    const auth = useContext(AuthContext)
    return auth
}