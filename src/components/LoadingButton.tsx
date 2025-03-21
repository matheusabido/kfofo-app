"use client"

import { Button, ButtonProps, Spinner } from "@chakra-ui/react";

interface Props extends ButtonProps {
    loading: boolean
}

export default function LoadingButton({ loading, children, ...props }: Props) {
    return <Button disabled={loading} {...props}>
        {loading ? <Spinner /> : children}
    </Button>
}