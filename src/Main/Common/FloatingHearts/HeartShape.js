/** @format */

import PropTypes from 'prop-types'
import React from 'react'
import { Image } from 'react-native'
import LoveIcon from '../../../asset/utils/love.png'

/**
 * @class HeartShape
 */

const HeartShape = ({ color }) => {
    return <Image source={LoveIcon} style={{ tintColor: color }} />
}

HeartShape.propTypes = {
    color: PropTypes.string,
}

HeartShape.defaultProps = {
    color: 'red',
}

/**
 * Exports
 */

export default HeartShape
