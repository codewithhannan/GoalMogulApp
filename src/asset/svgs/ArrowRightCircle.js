/** @format */

import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

function SvgComponent(props) {
    return (
        <Svg
            width={25}
            height={25}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                opacity={0.4}
                d="M10 0c5.515 0 10 4.486 10 10s-4.485 10-10 10C4.486 20 0 15.514 0 10S4.486 0 10 0z"
                fill="#42C0F5"
                fillOpacity={0.54}
            />
            <Path
                d="M8.557 5.78c.191 0 .383.072.53.218l3.486 3.47a.751.751 0 010 1.063l-3.487 3.472a.749.749 0 11-1.058-1.063L10.982 10 8.027 7.06a.75.75 0 01.53-1.28z"
                fill="#42C0F5"
            />
        </Svg>
    )
}

export default SvgComponent
