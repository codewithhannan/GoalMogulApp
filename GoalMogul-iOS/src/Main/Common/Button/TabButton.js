import React from 'react';
import { View, Text, Animated, Image } from 'react-native';
import _ from 'lodash';
import { DotIcon } from '../../../Utils/Icons';

// Default button style
const defaultButtonStyle = {
    selected: {
        backgroundColor: '#f8f8f8', // container background style
        tintColor: '#1998c9', // icon tintColor
        color: '#1998c9', // text color
        fontWeight: '700' // text fontWeight
    },
    unselected: {
        backgroundColor: 'white',
        tintColor: '#696969',
        color: '#696969',
        fontWeight: '600'
    }
};

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
    const buttonStyle = props.buttonStyle || defaultButtonStyle;
    const {
        color,
        backgroundColor,
        tintColor,
        fontWeight,
        fontSize,
        fontFamily
    } = props.onSelect ? buttonStyle.selected : buttonStyle.unselected;

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

    // Select iconStyle
    const iconStyle = props.onSelect ? { ...styles.iconStyle, ...props.iconStyle, tintColor }
        : { ...styles.iconStyle, ...props.iconStyle, tintColor };

    const icon = !props.iconSource ? null :
        (
            <Image
                source={props.iconSource}
                style={iconStyle}
            />
        );

    return (
        <View style={{ ...styles.containerStyle, backgroundColor }}>
            {icon}
            <Animated.Text
                style={{
                    ...styles.textStyle,
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
