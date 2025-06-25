import * as React from "react"
import { SVGProps } from "react"
export const BottomHalfMoon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1440 420"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a-BottomHalfMoon)">
      <mask
        id="b-BottomHalfMoon"
        width={1440}
        height={420}
        x={0}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: "luminance",
        }}
      >
        <path fill="#fff" d="M1440 0H0v420h1440V0Z" />
      </mask>
      <g mask="url(#b-BottomHalfMoon)">
        <g filter="url(#c-BottomHalfMoon)" opacity={0.5}>
          <path
            fill="url(#d-BottomHalfMoon)"
            d="M720 713c441.83 0 800-124.689 800-278.5S1161.83 156 720 156C278.172 156-80 280.689-80 434.5S278.172 713 720 713Z"
          />
        </g>
        <path
          fill="url(#e-BottomHalfMoon)"
          d="M720 713c463.92 0 840-124.689 840-278.5S1183.92 156 720 156c-463.919 0-840 124.689-840 278.5S256.081 713 720 713Z"
        />
        <g filter="url(#f-BottomHalfMoon)">
          <path
            fill="#0D0416"
            d="M720 713c463.92 0 840-122.898 840-274.5S1183.92 164 720 164c-463.919 0-840 122.898-840 274.5S256.081 713 720 713Z"
          />
        </g>
      </g>
    </g>
    <defs>
      <linearGradient
        id="d-BottomHalfMoon"
        x1={1520}
        x2={-80}
        y1={434.5}
        y2={434.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.197} stopColor="#D387FF" stopOpacity={0} />
        <stop offset={0.501} stopColor="#D387FF" />
        <stop offset={0.802} stopColor="#D387FF" stopOpacity={0} />
      </linearGradient>
      <linearGradient
        id="e-BottomHalfMoon"
        x1={1560}
        x2={-120}
        y1={434.5}
        y2={434.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.197} stopColor="#D387FF" stopOpacity={0} />
        <stop offset={0.501} stopColor="#D387FF" />
        <stop offset={0.802} stopColor="#D387FF" stopOpacity={0} />
      </linearGradient>
      <filter
        id="c-BottomHalfMoon"
        width={1840}
        height={797}
        x={-200}
        y={36}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_370"
          stdDeviation={60}
        />
      </filter>
      <filter
        id="f-BottomHalfMoon"
        width={1720}
        height={589}
        x={-140}
        y={144}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur
          result="effect1_foregroundBlur_47_370"
          stdDeviation={10}
        />
      </filter>
      <clipPath id="a-BottomHalfMoon">
        <path fill="#fff" d="M0 0h1440v420H0z" />
      </clipPath>
    </defs>
  </svg>
)