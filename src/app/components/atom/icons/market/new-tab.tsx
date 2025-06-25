import { SVGProps } from "react";

export function NewTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
      fill="currentColor"
      {...props}>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M9.502 4a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5H6.5a.5.5 0 1 0 0 1h1.795L3.992 5.303a.5.5 0 0 0 .707.708l4.303-4.304V3.5a.5.5 0 0 0 .5.5ZM1.5 1.5A1.5 1.5 0 0 0 0 3v5.5A1.5 1.5 0 0 0 1.5 10H7a1.5 1.5 0 0 0 1.5-1.5v-3a.5.5 0 1 0-1 0v3A.5.5 0 0 1 7 9H1.5a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5h3a.5.5 0 1 0 0-1h-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
