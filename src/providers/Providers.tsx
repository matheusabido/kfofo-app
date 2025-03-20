"use client"

import { Provider } from "@/components/chakra/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { AlertProvider } from "./AlertContext";

const queryClient = new QueryClient()
export default function Providers({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>
    <Provider>
      <AuthProvider>
        <AlertProvider>
          {children}
        </AlertProvider>
      </AuthProvider>
    </Provider>
  </QueryClientProvider>
}