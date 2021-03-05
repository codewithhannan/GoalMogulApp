/** @format */

import React from 'react'
import { View } from 'react-native'
import TabButton from './TabButton'

class TabButtonGroup extends React.PureComponent {
    renderTabs() {
        const { buttons, tabIconMap, buttonStyle } = this.props
        const { navigationState, jumpToIndex, jumpTo, statsState } = buttons
        const { index, routes } = navigationState

        return routes.map((b, i) => {
            const selected = index === i
            const iconSource = tabIconMap
                ? tabIconMap[b.key].iconSource
                : undefined
            const iconStyle = tabIconMap
                ? tabIconMap[b.key].iconStyle
                : undefined
            const hasDivider = i > 0

            return (
                <TabButton
                    buttonStyle={buttonStyle}
                    hasDivider={hasDivider}
                    key={b.key}
                    text={b.title}
                    selected={selected}
                    onPress={() => {
                        if (jumpTo) {
                            jumpTo(b.key)
                        } else {
                            jumpToIndex(i)
                        }
                    }}
                    count={statsState ? statsState[b.key] : undefined}
                    iconSource={iconSource}
                    iconStyle={iconStyle}
                />
            )
        })
    }

    render() {
        return <View style={styles.containerStyle}>{this.renderTabs()}</View>
    }
}

const styles = {
    containerStyle: {
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 0.5,
        marginBottom: 0.5,
        backgroundColor: 'white',
    },
}

export default TabButtonGroup
