/** @format */

import React from 'react'
import { View, Image } from 'react-native'

/* Components */
import Name from './Name'
import Category from './Category'

/* Asset */
import badge from '../asset/utils/badge.png'
import dropDown from '../asset/utils/dropDown.png'

const Headline = (props) => {
    // TODO: format time
    return (
        <View style={styles.containerStyle}>
            <Name text={props.name} />
            <Image style={styles.imageStyle} source={badge} />
            <Category text={props.category} />
            <View style={styles.caretContainer}>
                <Image source={dropDown} />
            </View>
        </View>
    )
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
    },
    caretContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    imageStyle: {
        alignSelf: 'center',
        marginLeft: 3,
        marginRight: 3,
    },
}

export default Headline
