'use client'

import { ReactNode, useEffect, useState } from "react";


export function NoSSR({ children }: { children: ReactNode }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        setIsClient(true)

    }, []);

    if (!isClient) return null;

    return <>{children}</>
}