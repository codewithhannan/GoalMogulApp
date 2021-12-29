/** @format */

import React, { Component } from 'react'
import { View, TouchableOpacity, Platform } from 'react-native'
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

import TabButton from './Button/TabButton'
import SubTabButton from './Button/SubTabButton'
import { default_style, color, text } from '../../styles/basic'

const WalkableView = walkthroughable(View)

/**
 * Note: stat shouldn't be provided together with tabNotificationMap
 */
class TabButtonGroup extends Component {
    renderButtons() {
        const {
            buttons,
            tabIconMap,
            subTab,
            buttonStyle,
            tabNotificationMap, // Map between tab key and if there is notification and its style, not required
            borderRadius,
        } = this.props

        const { navigationState, jumpTo, jumpToIndex } = buttons
        const { index, routes } = navigationState

        if (!routes) return null
        return routes.map((b, i) => {
            const isSelected = i === index

            const selectedStyle = isSelected
                ? (buttonStyle && buttonStyle.selected) || {
                      ...default_style.buttonText_1,
                      backgroundColor: color.GM_BLUE,
                      color: 'white',
                      //   tintColor: 'white',
                  }
                : (buttonStyle && buttonStyle.unselected) || {
                      ...default_style.buttonText_1,
                      fontFamily: text.FONT_FAMILY.REGULAR,
                      fontWeight: '500',
                      color: '#828282',
                      backgroundColor: '#F2F2F2',
                  }
            const iconSource = tabIconMap
                ? tabIconMap[b.key].iconSource
                : undefined
            const iconStyle = tabIconMap
                ? {
                      ...tabIconMap[b.key].iconStyle,
                      tintColor: selectedStyle.tintColor,
                  }
                : { tintColor: selectedStyle.tintColor }
            const containerStyle = {
                backgroundColor: selectedStyle.backgroundColor,
                borderRadius: borderRadius === undefined ? 100 : borderRadius,
            }
            const textStyle = selectedStyle
            const button = subTab ? (
                <SubTabButton
                    key={b.key}
                    text={b.title}
                    stat={b.stat}
                    iconSource={iconSource}
                    iconStyle={iconStyle}
                    containerStyle={containerStyle}
                    textStyle={textStyle}
                    statTextStyle={{
                        ...textStyle,
                        fontSize: default_style.smallText_1.fontSize,
                    }}
                    tabNotificationMap={tabNotificationMap}
                />
            ) : (
                <TabButton
                    tabKey={b.key}
                    text={b.title}
                    stat={b.stat}
                    iconSource={iconSource}
                    iconStyle={iconStyle}
                    containerStyle={containerStyle}
                    textStyle={textStyle}
                    statTextStyle={{
                        ...textStyle,
                        fontSize: default_style.smallText_1.fontSize,
                    }}
                    tabNotificationMap={tabNotificationMap}
                />
            )
            // render divider to the left
            const buttonComponent = (
                <TouchableOpacity
                    activeOpacity={0.6}
                    key={b.key}
                    style={{ flex: 1 }}
                    onPress={() => {
                        if (jumpTo) jumpTo(b.key)
                        else jumpToIndex(i)
                    }}
                >
                    {button}
                </TouchableOpacity>
            )

            if (b && b.tutorial) {
                const { tutorialText, order, name } = b.tutorial
                return (
                    <CopilotStep text={tutorialText} order={order} name={name}>
                        <WalkableView style={{ flex: 1 }}>
                            {buttonComponent}
                        </WalkableView>
                    </CopilotStep>
                )
            }

            return buttonComponent
        })
    }

    render() {
        const { padding } = this.props
        return (
            <View
                style={{
                    ...styles.containerStyle,
                    padding:
                        (padding !== undefined ? padding : 2) *
                        default_style.uiScale,
                    height:
                        (padding !== undefined ? 36 - padding : 34) *
                        default_style.uiScale,
                    borderRadius:
                        this.props.borderRadius === undefined
                            ? 100
                            : this.props.borderRadius,
                    backgroundColor: this.props.buttonStyle
                        ? this.props.buttonStyle.unselected.backgroundColor
                        : '#F2F2F2',
                }}
            >
                {this.renderButtons()}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        borderColor: '#E8E8E8',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 2 * default_style.uiScale,
        height: 33 * default_style.uiScale,
        margin: Platform.OS == 'ios' ? 8 : 0,
    },
}

export default TabButtonGroup
