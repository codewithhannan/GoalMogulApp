/** @format */

import React from 'react'
import { Text } from 'react-native'

const Name = (props) => {
    return <Text style={styles.containerStyle}>{props.text}</Text>
}

const styles = {
    containerStyle: {
        fontSize: 12,
        fontWeight: 'bold',
    },
}

export default Name
