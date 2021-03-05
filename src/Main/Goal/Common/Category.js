/** @format */

import React from 'react'
import { Text, View } from 'react-native'
import { default_style } from '../../../styles/basic'

const Category = (props) => {
    // TODO: format time
    return (
        <View style={{ flexDirection: 'row', flex: 1, flexWrap: 'wrap' }}>
            <Text
                style={[default_style.smallText_1, styles.containerStyle]}
                ellipsizeMode="tail"
                numberOfLines={1}
            >
                {props.text}
            </Text>
        </View>
    )
}

const styles = {
    containerStyle: {
        alignSelf: 'center',
    },
}

export default Category
