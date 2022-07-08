import * as React from "react"

function SvgCircleCheck({ height, width, fill, fillRule, stroke, strokeLinecap, strokeLinejoin, ...rest }) {
    return (
        <svg
            height={height ? height : 14}
            width={width ? width : 14}
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <g
                fill={fill ? fill : "none"}
                fillRule="evenodd"
                stroke={stroke ? stroke : "currentColor"}
                strokeLinecap={stroke ? stroke : "round"}
                strokeLinejoin={stroke ? stroke : "round"}
                transform="translate(2 2)"
            >
                <circle cx={8.5} cy={8.5} r={8} />
                <path d="M5.5 9.5l2 2 5-5" />
            </g>
        </svg>
    )
}

export default SvgCircleCheck
