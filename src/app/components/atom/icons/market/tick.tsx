import { SVGProps } from "react";

export function TickIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="currentColor"
      {...props}>
      <path
        fill="#3CFF00"
        fillRule="evenodd"
        stroke="#3CFF00"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m1 6 1.25-1.25 2.5 2.5 5-5L11 3.5 4.75 9.75 1 6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
