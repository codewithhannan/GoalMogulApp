/**
 * /*
 * NOTE: this element is deprecated due to milestone 1 UI chagnes
 *
 * @format
 */

import React from 'react'
import { Text, View, TouchableWithoutFeedback } from 'react-native'

const FilterBarButton = (props) => {
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.containerStyle}>
                <Text style={styles.textStyle}>
                    {props.data.text} ({props.data.number})
                </Text>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = {
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#1aa0dd',
    },
    textStyle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#ffffff',
        alignSelf: 'center',
    },
}

export default FilterBarButton
