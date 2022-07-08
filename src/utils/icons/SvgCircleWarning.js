import * as React from "react"

function SvgCircleWarning({ height, width, fill, stroke, strokeWarning, ...rest }) {
    return (
        <svg
            height={height ? height : 14}
            width={width ? width : 14}
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <g fill="none" fillRule="evenodd">
                <circle
                    cx={10.5}
                    cy={10.5}
                    r={8}
                    fill={fill ? fill : "none"}
                    stroke={stroke ? stroke : "currentColor"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M10.5 11.5v-5"
                    stroke={strokeWarning ? strokeWarning : "currentColor"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx={10.5} cy={14.5} fill="currentColor" r={1} />
            </g>
        </svg>
    )
}

export default SvgCircleWarning
