import React, { Component } from 'react';
import {
    TextInput,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Keyboard
} from 'react-native';
import _ from 'lodash';

// Assets
import menu from '../../../asset/header/menu.png';
const DEBUG_KEY = '[ UI InputField ]';

class InputField extends Component {

    constructor(props) {
        super(props);
        this.updateRef = this.updateRef.bind(this, 'input');
        this.onChange = this.onChange.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onIconPress = this.onIconPress.bind(this);
        this.handleOnLayout = this.handleOnLayout.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.keyboardDidShow = this.keyboardDidShow.bind(this);
        this.keyboardDidHide = this.keyboardDidHide.bind(this);
        this.state = { keyboardHeight: 0 }, this.scrollToTimer = undefined;
    }

    componentDidMount() {
        console.log(`${DEBUG_KEY}: mounting input field`);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    componentWillUnmount() {
        Keyboard.removeListener('keyboardDidShow', this.keyboardDidShow);
        Keyboard.removeListener('keyboardDidHide', this.keyboardDidHide);

        if (this.scrollToTimer) {
            clearTimeout(this.scrollToTimer);
        }
    }

    keyboardDidShow(e) {
        this.setState({
            ...this.state,
            keyboardHeight: e.endCoordinates.height,
        });
    }

    keyboardDidHide(e) {
        this.setState({
            ...this.state,
            keyboardHeight: 0,
        });
    }

    handleOnLayout = ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        // console.log(`${DEBUG_KEY}: nativeEvent with layout is: `, layout);
    }

    onChange(event) {
        const { onChange } = this.props;
        // console.log('something happens');
        if ('function' === typeof onChange) {
            onChange(event);
        }
    }

    onChangeText(text) {
        const { onChange } = this.props.input;

        if ('function' === typeof onChange) {
            onChange(text);
        }
    }

    onIconPress() {
        const { iconOnPress } = this.props;
        if (iconOnPress !== undefined) {
            iconOnPress();
        } else {
            this.clear();
        }
    }

    onFocus() {
        const { input, scrollTo, type, index } = this.props;
        const { onFocus } = input;
        if (onFocus) onFocus();
        const screenHeight = Dimensions.get('window').height;
        this.view.measure((fx, fy, width, height, px, py) => {
            if ((py + this.state.keyboardHeight + 46) > screenHeight) {
                const scrollToHeight = (py - (screenHeight / 2)) + 46 + 40 + 10;
                console.log('scrollToHeight is: ', scrollToHeight);
                if (this.scrollToTimer) clearTimeout(this.scrollToTimer);

                this.scrollToTimer = setTimeout(() => scrollTo(scrollToHeight, type, index), 50);
            } else {
                console.log(`${DEBUG_KEY}: keyboardHeight: `, this.state.keyboardHeight);
            }
        })
        // console.log(`${DEBUG_KEY}: nativeEvent with layout is: `, this.view.measure());
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    clear() {
        this.input.clear();
        /* onChangeText is not triggered by .clear() */
        this.onChangeText('');
    }

    render() {
        const {
            input: { value },
            multiline,
            editable,
            numberOfLines,
            placeholder,
            style,
            iconSource,
            iconStyle,
            iconOnPress,
            move,
            moveEnd,
            canDrag,
            autoCorrect,
            autoCapitalize,
            blurOnSubmit,
            inputContainerStyle,
            ...custom
        } = this.props;

        const gestureHandler = canDrag
            ? (
                <TouchableOpacity
                    onLongPress={move}
                    onPressOut={moveEnd}
                    style={{ padding: 12, paddingRight: 6 }}
                >
                    <Image source={menu} style={{ height: 20, width: 22 }} />
                </TouchableOpacity>
            ) : null;

        return (
            <View
                style={{ ...styles.inputContainerStyle, ...inputContainerStyle }}
                ref={v => { this.view = v; }}
            >
                {gestureHandler}
                <TextInput
                    ref={this.updateRef}
                    title={custom.title}
                    autoCapitalize={autoCapitalize || 'none'}
                    autoCorrect={autoCorrect || false}
                    onChangeText={this.onChangeText}
                    blurOnSubmit={blurOnSubmit || false}
                    onChange={this.onChange}
                    returnKeyType='done'
                    multiline={multiline || false}
                    onFocus={this.onFocus}
                    editable={editable}
                    placeholder={placeholder}
                    style={style}
                    value={_.isEmpty(value) ? '' : value}
                    {...custom}
                />
                {iconSource ? <TouchableOpacity
                    activeOpacity={0.6}
                    style={{ padding: 12, paddingLeft: 6, alignItems: 'flex-end', alignSelf: 'center' }}
                    onPress={this.onIconPress}
                >
                    <Image source={iconSource} style={{ ...iconStyle }} />
                </TouchableOpacity> : null}
            </View>
        );
    }
}

const styles = {
    inputContainerStyle: {
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#E0E0E0'
    }
};

export default InputField;
