import * as React from "react"
import { SVGProps } from "react"

export const EarnIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            fill="#fff"
            stroke="#fff"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15.25 8a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0ZM6.847 19.25h10.305c1.142 0 2.022-.982 1.488-1.992C17.857 15.773 16.069 14 12 14s-5.857 1.773-6.641 3.258c-.533 1.01.346 1.992 1.488 1.992Z"
        />
    </svg>
)
