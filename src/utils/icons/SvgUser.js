import * as React from "react"

function SvgUserCircle(props) {
  return (
    <svg
      height={15}
      viewBox="0 0 21 21"
      width={15}
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
        <path d="M14.5 13.5c-.662-2.274-3.2-3.025-6-3.025-2.727 0-5.27.869-6 3.025m6-11a3 3 0 013 3v1a3 3 0 01-6 0v-1a3 3 0 013-3z" />
      </g>
    </svg>
  )
}

export default SvgUserCircle
