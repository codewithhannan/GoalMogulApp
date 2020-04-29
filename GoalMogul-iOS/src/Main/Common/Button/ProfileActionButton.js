import React from 'react';
import {
    View,
    Image,
    Text
} from 'react-native';
import DelayedButton from './DelayedButton';

const DEBUG_KEY = '[ UI ProfileActionButton ]';
const ProfileActionButton = (props) => {
    let image = null;
    const color = props.containerStyle.color || 'black';

    if (props.source) {
        image = (
            <Image
                source={props.source}
                style={{ height: 15, width: 15, ...props.iconStyle, tintColor: color }}
            />
        );
    }

    const textComponent = props.text
        ? (
            <Text style={{
                fontSize: 12,
                fontWeight: 'bold',
                marginLeft: 5,
                alignSelf: 'center',
                color,
                ...props.textStyle
            }}>
                {props.text}
            </Text>
        ) : null

    return (
        <DelayedButton activeOpacity={0.6} onPress={props.onPress}>
            <View
                style={{
                    flexDirection: 'row',
                    alignSelf: 'flex-end',
                    padding: 7,
                    borderRadius: 5,
                    ...props.containerStyle
                }}
            >
                {image}
                {textComponent}
            </View>
        </DelayedButton>
    );
};

export default ProfileActionButton;
