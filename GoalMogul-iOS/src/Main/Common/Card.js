/** @format */

import React from 'react'
import { View } from 'react-native'

const Card = (props) => {
    return <View style={styles.containerStyle}>{props.children}</View>
}

const styles = {
    containerStyle: {
        display: 'flex',
        borderWidth: 1,
        borderColor: '#eaeaea',
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 7,
    },
}

export default Card
