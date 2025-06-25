import * as React from "react"
import { SVGProps } from "react"
export const AuditIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            fill="#fff"
            stroke="#fff"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m4 18 .003-3.979a.5.5 0 0 1 .5-.5h5c.461 0 .459-.409.459-1.382 0-.973-2.451-1.792-2.451-5.212 0-3.421 2.539-4.427 4.649-4.427s4.409 1.006 4.409 4.426c0 3.421-2.438 3.965-2.438 5.213 0 1.249 0 1.383.39 1.383h4.98a.5.5 0 0 1 .5.5V18H4Z"
        />
        <path
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 21h16"
        />
    </svg>
)
