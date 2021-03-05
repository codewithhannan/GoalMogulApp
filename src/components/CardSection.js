/** @format */

import React from 'react'
import { View } from 'react-native'

const CardSection = (props) => {
    return <View style={styles.containerStyle}>{props.children}</View>
}

const styles = {
    containerStyle: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        position: 'relative',
        marginTop: 4,
        marginBottom: 4,
        height: 50,
        flexDirection: 'column',
    },
}

export default CardSection
