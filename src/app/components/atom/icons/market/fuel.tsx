import { SVGProps } from "react";

export function FuelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      fill="none"
      {...props}>
      <g clipPath="url(#a)">
        <path
          fill="#fff"
          d="m10.927 1.573-1-1a.25.25 0 1 0-.354.354l.823.823-.823.823a.25.25 0 0 0-.073.177v.75c0 .552.449 1 1 1v4.25a.25.25 0 0 1-.5 0v-.5a.75.75 0 0 0-.75-.75H9V1a1 1 0 0 0-1-1H3c-.551 0-1 .448-1 1v9a1 1 0 0 0-1 1v.75a.25.25 0 0 0 .25.25h8.5a.25.25 0 0 0 .25-.25V11a1 1 0 0 0-1-1V8h.25a.25.25 0 0 1 .25.25v.5a.75.75 0 0 0 1.5 0v-7a.25.25 0 0 0-.073-.177ZM8 4.255a.25.25 0 0 1-.25.25h-4.5a.25.25 0 0 1-.25-.25V1.25A.25.25 0 0 1 3.25 1h4.5a.25.25 0 0 1 .25.25v3.005Z"
        />
      </g>
    </svg>
  );
}
