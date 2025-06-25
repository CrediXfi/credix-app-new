import { SVGProps } from "react";

export function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
      fill="none"
      {...props}>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M8.47 6.22a.75.75 0 0 1 1.06 0l4.243 4.243a.75.75 0 1 1-1.06 1.06L9 7.81l-3.713 3.713a.75.75 0 0 1-1.06-1.06L8.47 6.22Z"
        clipRule="evenodd"
        opacity={0.6}
      />
    </svg>
  );
}
