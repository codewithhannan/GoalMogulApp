import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm';

import Divider from './Divider';
import TabButton from './Button/TabButton';
import SubTabButton from './Button/SubTabButton';


const WalkableView = walkthroughable(View);

/**
 * Note: stat shouldn't be provided together with tabNotificationMap
 */
class TabButtonGroup extends Component {

    renderButton() {
        const {
            buttons,
            tabIconMap,
            subTab,
            buttonStyle,
            noVerticalDivider, // Vertical border between two tabs
            tabNotificationMap, // Map between tab key and if there is notification and its style, not required
            borderRadius
        } = this.props;

        const { navigationState, jumpTo, jumpToIndex } = buttons;
        const { index, routes } = navigationState;

        return routes.map((b, i) => {
            const isFirst = i === 0, isLast = i === routes.length - 1, isSelected = i === index;

            const selectedStyle = isSelected ? buttonStyle.selected : buttonStyle.unselected;
            const iconSource = tabIconMap ? tabIconMap[b.key].iconSource : undefined;
            const iconStyle = tabIconMap ? {
                ...tabIconMap[b.key].iconStyle,
                tintColor: selectedStyle.tintColor
            } : { tintColor: selectedStyle.tintColor };
            const containerStyle = {
                backgroundColor: selectedStyle.backgroundColor,
                borderRadius
            };
            const textStyle = {
                color: selectedStyle.color,
                fontWeight: selectedStyle.fontWeight,
                fontSize: selectedStyle.fontSize,
                fontFamily: selectedStyle.fontFamily
            }
            const button = subTab ? (
                <SubTabButton
                    key={b.key}
                    text={b.title}
                    stat={b.stat}
                    iconSource={iconSource}
                    iconStyle={iconStyle}
                    containerStyle={containerStyle}
                    textStyle={textStyle}
                    statTextStyle={{ ...textStyle, fontSize: 10 }}
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
                    statTextStyle={{ ...textStyle, fontSize: 10 }}
                    tabNotificationMap={tabNotificationMap}
                />
            );
            // render divider to the left
            const buttonComponent = (
                <TouchableOpacity
                    activeOpacity={0.6}
                    key={b.key}
                    style={{ flex: 1 }}
                    onPress={() => {
                        if (jumpTo) jumpTo(b.key);
                        else jumpToIndex(i);
                    }}
                >
                    {button}
                </TouchableOpacity>
            );

            if (b && b.tutorial) {
                const { tutorialText, order, name } = b.tutorial;
                return (
                    <CopilotStep text={tutorialText} order={order} name={name}>
                        <WalkableView style={{ flex: 1 }}>
                            {buttonComponent}
                        </WalkableView>
                    </CopilotStep>
                );
            }

            return buttonComponent;
        });
    }

    render() {
        return (
            <View style={{
                ...styles.containerStyle,
                borderRadius: this.props.borderRadius,
                backgroundColor: this.props.buttonStyle.unselected.backgroundColor
            }}>
                {this.renderButton()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 2
    }
};

export default TabButtonGroup;
