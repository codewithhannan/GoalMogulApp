/** @format */

import React from 'react'
import { Text } from 'react-native'

const Content = (props) => {
    // TODO: format time
    return <Text style={styles.containerStyle}>{props.content}</Text>
}

const styles = {
    containerStyle: {
        fontSize: 14,
        marginTop: 7,
    },
}

//TODO: validate prop types
export default Content
