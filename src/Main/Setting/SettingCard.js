/** @format */

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image } from 'react-native'

import DelayedButton from '../Common/Button/DelayedButton'

class SettingCard extends Component {
    renderIcon() {
        const iconStyle = this.props.iconStyle || styles.titleIconStyle
        const { icon } = this.props
        if (icon) {
            return <Image source={icon} style={iconStyle} />
        }
        return null
    }

    render() {
        const { containerStyle } = this.props
        return (
            <DelayedButton
                activeOpacity={0.6}
                onPress={this.props.onPress}
                delay={700}
            >
                <View style={[styles.containerStyle, { ...containerStyle }]}>
                    <View style={styles.titleContainerStyle}>
                        {this.renderIcon()}
                        <Text style={styles.titleStyle}>
                            {this.props.title}
                        </Text>
                    </View>
                    <Text style={styles.explanationTextStyle}>
                        {this.props.explanation}
                    </Text>
                </View>
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
    },
    titleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleIconStyle: {
        height: 20,
        width: 20,
        marginRight: 5,
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    explanationTextStyle: {
        fontSize: 12,
        marginTop: 6,
        marginLeft: 3,
        color: '#AAA',
    },
}

export default SettingCard
