/**
 * @format
 * --------------------------------------------------------
 * This components should be placed outise of SafeViewArea
 * --------------------------------------------------------
 * */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

/* Actions */
import { back } from '../../../actions'

import DelayedButton from '../Button/DelayedButton'

import { HEADER_STYLES } from '../../../styles/Header'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'

class FormHeader extends Component {
    onSavePress = () => {
        if (this.props.segmants) {
            // trackWithProperties(EVENT.PROFILE_UPDATED, 'save')
            this.props.onSubmit()
        } else {
            this.props.onSubmit()
        }
    }

    onCancelPress = () => {
        if (this.props.segmants) {
            // trackWithProperties(EVENT.PROFILE_UPDATED, 'cancel')
            this.props.back()
        } else {
            this.props.back()
        }
    }

    render() {
        const { actionDisabled } = this.props
        const actionTextStyle = actionDisabled
            ? { ...styles.rightTextStyle, color: 'lightgray' }
            : styles.rightTextStyle

        return (
            <View style={styles.headerStyle}>
                <DelayedButton activeOpacity={0.6} onPress={this.onCancelPress}>
                    <Text style={styles.leftTextStyle}>Cancel</Text>
                </DelayedButton>
                <Text style={styles.titleTextStyle}>{this.props.title}</Text>
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
        ...HEADER_STYLES.headerContainer,
        justifyContent: 'space-between',
    },
    leftTextStyle: HEADER_STYLES.buttonText,
    titleTextStyle: HEADER_STYLES.title,
    rightTextStyle: HEADER_STYLES.buttonText,
}

export default connect(null, {
    back,
})(FormHeader)
