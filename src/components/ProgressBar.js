/** @format */

import React from 'react'
import { Text, View, Image } from 'react-native'

/* Icon */
import Bar from '../asset/utils/progressBar.png'

const ProgressBar = (props) => {
    return (
        <View style={styles.containerStyle}>
            <Text style={styles.textStyle}>{props.startTime}</Text>
            <Image source={Bar} style={styles.imageStyle} />
            <Text style={styles.textStyle}>{props.endTime}</Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        marginTop: 2,
        marginBottom: 16,
        marginLeft: 14,
        marginRight: 14,
    },
    imageStyle: {
        flex: 6,
    },
    textStyle: {
        color: '#7b7b7b',
        fontSize: 8.5,
        alignSelf: 'center',
    },
}

//TODO: validate prop types
export default ProgressBar
