/** @format */

import React from 'react'
import { View, Text, Image } from 'react-native'
import { Icon } from '@ui-kitten/components'
import { color, default_style } from '../../../styles/basic'
import DelayedButton from './DelayedButton'

/**
 * Renders 'Create Goal' and 'Create Update' button card for Home/Profile pages
 * @prop containerStyle
 * @prop onCreateUpdatePress
 * @prop onCreateGoalPress
 */
const CreateContentButtons = (props) => {
    const { onCreateUpdatePress, onCreateGoalPress } = props
    const containerStyle = props.containerStyle || {}

    return (
        <View style={[styles.buttonsContainer, containerStyle]}>
            {/* Share Update */}
            <DelayedButton
                touchableHighlight
                style={styles.createContentButton}
                underlayColor={'#F2F2F2'}
                onPress={onCreateUpdatePress}
            >
                {/* Wrapping button contents in a View since TouchableHighlight does not accept multiple children */}
                <View style={{ alignItems: 'center' }}>
                    <Icon
                        name="feather"
                        pack="material-community"
                        style={styles.createContentButtonIcon}
                    />
                    <Text style={styles.createContentButtonText}>
                        Share Update
                    </Text>
                </View>
            </DelayedButton>

            {/* Hairline button seperator */}
            <View style={default_style.cardVerticalSeparator} />

            {/* Create Goal */}
            <DelayedButton
                touchableHighlight
                style={styles.createContentButton}
                underlayColor={'#F2F2F2'}
                onPress={onCreateGoalPress}
            >
                {/* Wrapping button contents in a View since TouchableHighlight does not accept multiple children */}
                <View style={{ alignItems: 'center' }}>
                    <Icon
                        name="bullseye-arrow"
                        pack="material-community"
                        style={styles.createContentButtonIcon}
                    />
                    <Text style={styles.createContentButtonText}>
                        Create Goal
                    </Text>
                </View>
            </DelayedButton>
        </View>
    )
}

const styles = {
    buttonsContainer: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    createContentButton: {
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    createContentButtonIcon: {
        height: 24,
        width: 24,
        tintColor: '#828282',
    },
    createContentButtonText: {
        ...default_style.buttonText_1,
        color: '#828282',
        marginTop: 4,
    },
    createContentButtonSeperator: {
        height: '75%',
        width: default_style.hairlineWidth,
        backgroundColor: color.GM_BORDER_COLOR,
    },
}

export default CreateContentButtons
