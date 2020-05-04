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
            const selectedStyle = i === index ? buttonStyle.selected : buttonStyle.unselected;
            const iconSource = tabIconMap ? tabIconMap[b.key].iconSource : undefined;
            const iconStyle = tabIconMap ? {
                ...tabIconMap[b.key].iconStyle,
                tintColor: selectedStyle.tintColor
            } : { tintColor: selectedStyle.tintColor };
            const containerStyle = {
                backgroundColor: selectedStyle.backgroundColor,
                borderTopLeftRadius: i === 0 ? borderRadius : 0,
                borderBottomLeftRadius: i === 0 ? borderRadius : 0,
                borderTopRightRadius: (i === routes.length - 1) ? borderRadius : 0,
                borderBottomRightRadius: (i === routes.length - 1) ? borderRadius : 0
            };
            const textStyle = {
                color: selectedStyle.color,
                fontWeight: selectedStyle.fontWeight,
                fontSize: selectedStyle.fontSize,
                fontFamily: selectedStyle.fontFamily
            }
            const button = subTab
                ? (
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
                )
                : (
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

            let buttonComponent;
            if (i !== 0) {
                // render divider to the left
                const divider = noVerticalDivider ? null : (<Divider />);
                buttonComponent = (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        key={b.key}
                        style={styles.dividerContainerStyle}
                        onPress={() => {
                            if (jumpTo) jumpTo(b.key);
                            else jumpToIndex(i);
                        }}
                    >
                        {divider}
                        {button}
                    </TouchableOpacity>
                );
            } else {
                buttonComponent = (
                    <TouchableOpacity
                        activeOpacity={0.6}
                        key={b.key}
                        style={styles.dividerContainerStyle}
                        onPress={() => {
                            if (jumpTo) jumpTo(b.key);
                            else jumpToIndex(i);
                        }}
                    >
                        {button}
                    </TouchableOpacity>
                );
            }

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
            <View style={{ ...styles.containerStyle, borderRadius: this.props.borderRadius }}>
                {this.renderButton()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        height: 30,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F2F2F2',
        backgroundColor: 'white'
    },
    dividerContainerStyle: {
        flexDirection: 'row',
        flex: 1
    }
};

export default TabButtonGroup;
