import * as React from "react"

function SvgDot({ height, width, fill, stroke, ...rest }) {
    return (
        <svg
            height={height ? height : 11}
            width={width ? width : 11}
            viewBox="0 0 21 21"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <circle
                cx={10.5}
                cy={10.5}
                fill={fill ? fill : 'none'}
                r={9}
                stroke={stroke ? stroke : '#2E2E32'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default SvgDot