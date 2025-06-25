'use client'

import { getIsSidebarExpandedOnClient, IsExpandedType, useSidebarExpand } from "@/lib/hooks/use-sidebar-expand"
import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
    isSidebarExpandedServerState: IsExpandedType
}>

export function DashboardLayoutWrapper({ children, isSidebarExpandedServerState }: Props) {
    const { isExpanded } = useSidebarExpand(isSidebarExpandedServerState)
    const IS_EXPANDED = getIsSidebarExpandedOnClient(isSidebarExpandedServerState, isExpanded)
    return <div className={cn("md:mt-12 mt-5 pb-20 pe-5 duration-500 overflow-x-hidden max-w-screen", IS_EXPANDED ? 'ps-5 xl:ps-[275px]' : 'ps-5 xl:ps-[149px]')}>
        {children}
    </div>
}