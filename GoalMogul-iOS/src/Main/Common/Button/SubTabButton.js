import React from 'react';
import { View, Text, Animated, Image } from 'react-native';


const SubTabButton = (props) => {
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
    } =  buttonStyle;

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
        marginRight: 9
    }
};

export default SubTabButton;
