import React from 'react';
import { View, Text, Animated, Image } from 'react-native';

// Default button style
const defaultButtonStyle = {
    selected: {
        backgroundColor: '#1aa0dd', // container background style
        tintColor: '#1aa0dd', // icon tintColor
        color: 'white', // text color
        fontWeight: '700' // text fontWeight
    },
    unselected: {
        backgroundColor: 'white',
        tintColor: '#696969',
        color: '#696969',
        fontWeight: '600'
    }
};

const SubTabButton = (props) => {
    const buttonStyle = props.buttonStyle || defaultButtonStyle;
    const {
        color,
        backgroundColor,
        tintColor,
        fontWeight,
        fontSize,
        fontFamily
    } = props.onSelect ? buttonStyle.selected : buttonStyle.unselected;

    // const color = props.onSelect ? '#1aa0dd' : 'white';
    const stat = !props.stat ? null :
        (
            <View>
                <DotIcon
                    iconStyle={{ tintColor: tintColor, width: 3, height: 3, marginLeft: 4, marginRight: 4 }}
                />
                <Text style={styles.textStyle}>
                    {props.stat}
                </Text>
            </View>
        );

    // Select iconStyle
    const iconStyle = props.onSelect
        ? { ...styles.iconStyle, ...props.iconStyle, tintColor }
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

export default SubTabButton;
