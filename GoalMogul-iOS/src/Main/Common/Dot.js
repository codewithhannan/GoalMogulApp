/** @format */

import React from 'react'

import { DotIcon } from '../../Utils/Icons'

const Dot = (props) => {
    const iconContainerStyle = props.iconContainerStyle
        ? { ...props.iconContainerStyle }
        : { ...styles.iconContainerStyle }

    const color = props.dotColor ? props.dotColor : '#696969'
    const dotSize = props.dotSize ? props.dotSize : 16

    return (
        <DotIcon
            iconContainerStyle={{ ...iconContainerStyle }}
            iconStyle={{
                tintColor: color,
                width: 4,
                height: 4,
                marginLeft: 4,
                marginRight: 4,
            }}
        />
    )
}
{
    /* <Icon
      name='dot-single'
      type='entypo'
      color='#818181'
      size={dotSize}
      iconStyle={{ color }}
      containerStyle={iconContainerStyle}
    /> */
}
const styles = {
    iconContainerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
}

export default Dot
