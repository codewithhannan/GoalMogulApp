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
import menu from '../../../asset/utils/drag_indicator.png';
import { DEFAULT_STYLE, BACKGROUND_COLOR } from '../../../styles';


const { width } = Dimensions.get('window');
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
        const scrollToHeight = screenHeight - this.state.keyboardHeight;

        if (this.scrollToTimer) clearTimeout(this.scrollToTimer);

        this.scrollToTimer = setTimeout(() => scrollTo(scrollToHeight, type, index), 50);
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
                    style={styles.gestureHandlerContainer}
                >
                    <Image source={menu} resizeMode="contain" style={{ ...DEFAULT_STYLE.buttonIcon_1, tintColor: '#AAA' }} />
                </TouchableOpacity>
            ) : null;

        return (
            <View
                style={[styles.inputContainerStyle, inputContainerStyle]}
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
                    style={{ backgroundColor: 'white', ...style }}
                    value={_.isEmpty(value) ? '' : value}
                    {...custom}
                />
                {iconSource ? <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        backgroundColor: 'white',
                        padding: 12,
                        paddingLeft: 6,
                        height: '100%'
                    }}
                    onPress={this.onIconPress}
                >
                    <Image source={iconSource} style={iconStyle} />
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
        borderColor: '#DFE0E1',
        backgroundColor: BACKGROUND_COLOR
    },
    gestureHandlerContainer: {
        backgroundColor: '#F5F7FA',
        borderRightWidth: 1,
        borderColor: '#DFE0E1',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70 * DEFAULT_STYLE.uiScale,
        width: 35 * DEFAULT_STYLE.uiScale
    }
};

export default InputField;
