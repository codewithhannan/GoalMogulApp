/** @format */

import React from 'react'
import { View } from 'react-native'

const Card = (props) => {
    return <View style={styles.containerStyle}>{props.children}</View>
}

const styles = {
    containerStyle: {
        display: 'flex',
        borderColor: '#eaeaea',
        borderBottomWidth: 1,
        backgroundColor: 'transparent',
        marginBottom: 1,
    },
}

export default Card
