import React from 'react';
import { View, Text, Animated, Image } from 'react-native';
import _ from 'lodash';
import { DotIcon } from '../../../Utils/Icons';


const renderNotificationIndicator = (props) => {
    const { tabNotificationMap, tabKey, isSelected } = props;
    if (!tabNotificationMap) return null;
    if (!tabNotificationMap.hasOwnProperty(tabKey) || !_.has(tabNotificationMap, tabKey)) return null;

    const { hasNotification, style, containerStyle, selectedStyle, selectedContainerStyle } = _.get(tabNotificationMap, tabKey);
    if (!hasNotification) return null;
    return (
        <View style={{ ...containerStyle, ...(isSelected ? selectedContainerStyle : {}) }}>
            <View style={{ ...style, ...(isSelected ? selectedStyle : {}) }} />
        </View>
    )
};

const TabButton = (props) => {
    const { tabNotificationMap, tabKey } = props;
    const buttonStyle = props.buttonStyle;
    const {
        color,
        backgroundColor,
        tintColor,
        fontWeight,
        fontSize,
        fontFamily,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius
    } = buttonStyle;

    console.log("\n\n\n\n\n\n", borderBottomRightRadius, "\n\n\n\n\n\n\n");
    const stat = !props.stat ? null :
        (
            <View>
                <DotIcon
                    iconStyle={{ tintColor: '#818181', width: 3, height: 3, marginLeft: 4, marginRight: 4 }}
                />
                <Text style={styles.textStyle}>
                    {props.stat}
                </Text>
            </View>
        );

    const icon = !props.iconSource ? null :
        (
            <Image
                source={props.iconSource}
                style={{ ...styles.iconStyle, ...props.iconStyle, tintColor }}
            />
        );

    return (
        <View style={{
            ...styles.containerStyle,
            backgroundColor,
            borderTopLeftRadius,
            borderTopRightRadius,
            borderBottomLeftRadius,
            borderBottomRightRadius
        }}>
            {icon}
            <Animated.Text
                style={{
                    color,
                    fontWeight,
                    fontSize,
                    fontFamily
                }}
            >
                {props.text}
            </Animated.Text>
            {stat}
            {renderNotificationIndicator({ tabNotificationMap, tabKey, isSelected: props.onSelect })}
        </View>
    );
};

const styles = {
    containerStyle: {
        flex: 1,
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    textStyle: {
        fontSize: 10,
        color: '#696969',
    },
    iconStyle: {
        height: 12,
        width: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        tintColor: '#1998c9',
        marginRight: 7
    }
};

export default TabButton;
