import * as React from "react"

function SvgSupport(props) {
  return (
    <svg
      height={23}
      viewBox="0 0 21 21"
      width={23}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        fill="none"
        fillRule="evenodd"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(2 2)"
      >
        <circle cx={8.5} cy={8.5} r={8} />
        <circle cx={8.5} cy={8.5} r={4} />
        <path d="M11.5 5.5L14 3M11.5 11.5L14 14M5.5 11.5L3 14M5.5 5.5L3 3" />
      </g>
    </svg>
  )
}

export default SvgSupport
