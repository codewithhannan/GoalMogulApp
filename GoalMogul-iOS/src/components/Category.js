/** @format */

import React from 'react'
import { Text } from 'react-native'

const Category = (props) => {
    // TODO: format time
    return <Text style={styles.containerStyle}>in {props.text}</Text>
}

const styles = {
    containerStyle: {
        fontSize: 11,
        color: '#6d6d6d',
        fontWeight: '600',
    },
}

export default Category
