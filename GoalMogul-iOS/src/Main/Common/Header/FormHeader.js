/** @format */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'
import Constants from 'expo-constants'

/* Actions */
import { back } from '../../../actions'

import DelayedButton from '../Button/DelayedButton'
import { GM_BLUE, DEFAULT_STYLE } from '../../../styles'

import { IPHONE_MODELS } from '../../../Utils/Constants'

class FormHeader extends Component {
    onSavePress = () => {
        this.props.onSubmit()
    }

    onCancelPress = () => {
        this.props.back()
    }

    render() {
        const { actionDisabled } = this.props
        const { cancelTextStyle, saveTextStyle, titleTextStyle } = styles

        const actionTextStyle = actionDisabled
            ? { ...saveTextStyle, color: 'lightgray' }
            : saveTextStyle

        const paddingTop =
            Platform.OS === 'ios' &&
            IPHONE_MODELS.includes(Constants.platform.ios.model.toLowerCase())
                ? 0
                : 15

        return (
            <View style={{ ...styles.headerStyle, paddingTop }}>
                <DelayedButton activeOpacity={0.6} onPress={this.onCancelPress}>
                    <Text style={cancelTextStyle}>Cancel</Text>
                </DelayedButton>
                <Text style={titleTextStyle}>{this.props.title}</Text>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={this.onSavePress}
                    disabled={actionDisabled}
                >
                    <Text style={actionTextStyle}>Save</Text>
                </DelayedButton>
            </View>
        )
    }
}

const styles = {
    headerStyle: {
        flexDirection: 'row',
        backgroundColor: GM_BLUE,
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cancelTextStyle: {
        ...DEFAULT_STYLE.subTitleText_1,
        color: 'white',
    },
    titleTextStyle: {
        ...DEFAULT_STYLE.titleText_1,
        color: 'white',
    },
    saveTextStyle: {
        ...DEFAULT_STYLE.subTitleText_1,
        color: 'white',
    },
}

export default connect(null, {
    back,
})(FormHeader)
