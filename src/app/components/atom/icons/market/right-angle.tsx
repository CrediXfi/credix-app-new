import { SVGProps } from "react";

export function RightAngleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}>
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95-4.95-4.95a1 1 0 0 1 1.414-1.414l5.657 5.657Z"
        clipRule="evenodd"
        opacity={0.7}
      />
    </svg>
  );
}
