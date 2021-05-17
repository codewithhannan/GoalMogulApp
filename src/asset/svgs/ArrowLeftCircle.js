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
                d="M10 20C4.485 20 0 15.514 0 10S4.485 0 10 0c5.514 0 10 4.486 10 10s-4.486 10-10 10z"
                fill="#42C0F5"
                fillOpacity={0.54}
            />
            <Path
                d="M11.443 14.22a.747.747 0 01-.53-.218l-3.486-3.47a.751.751 0 010-1.063l3.487-3.472a.749.749 0 111.058 1.063L9.019 10l2.953 2.94a.75.75 0 01-.53 1.28z"
                fill="#42C0F5"
            />
        </Svg>
    )
}

export default SvgComponent
