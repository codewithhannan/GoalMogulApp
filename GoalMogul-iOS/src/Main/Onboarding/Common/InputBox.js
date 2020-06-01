import React from 'react';
import _ from "ramda";
import {
    View,
    Image,
    TextInput,
    Text
} from 'react-native';
import CountryPicker, { Flag } from 'react-native-country-picker-modal'
import dropDown from '../../../asset/utils/dropDown.png';
import { GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../../styles';
import DelayedButton from '../../Common/Button/DelayedButton';

/**
 * Onboarding flow Input Box
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class InputBox extends React.Component {

    focus() {
        this.refs["textInput"].focus();
    }

    renderFlagButton(props, countryCode) {
        const { onOpen } = props;
        const callingCode = countryCode.country && countryCode.country.callingCode && !_.isEmpty(countryCode.country.callingCode)
            ? countryCode.country.callingCode[0]
            : 0;


        return (
            <DelayedButton style={{ flexDirection: "row" }} onPress={onOpen}>
                <Flag countryCode={countryCode.cca2} flagSize={14} />
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM, paddingTop: 2 }}>{`${countryCode.cca2} `}</Text>
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM, paddingTop: 1 }}>+({`${callingCode}`})</Text>
            </DelayedButton>
        );
    }

    renderInputTitle() {
        const { inputTitle } = this.props;
        if (this.props.optional) {
            return (
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_1, fontFamily: GM_FONT_FAMILY.GOTHAM }}>
                    <Text style={{ fontWeight: "bold", fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD }}>{inputTitle}</Text>
                    <Text>{" "}(Optional)</Text>
                </Text>
            );
        }
        return (
            <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_1, fontFamily: GM_FONT_FAMILY.GOTHAM }}>
                    <Text style={{ color: "red" }}>*</Text>
                    <Text style={{ fontWeight: "bold", fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD }}>{inputTitle}</Text>
                </Text>
            </View>
        );
    }

    renderPhoneInput() {
        const { inputTitle, placeholderTextColor, onCountryCodeSelected, countryCode, ...custom } = this.props;
        return (
            <View style={styles.containerStyle}>
                {this.renderInputTitle()} 
                <View style={styles.textInputContainerStylePhone}>
                    {this.renderCountryCode(countryCode, onCountryCodeSelected)}
                    <TextInput 
                        ref="textInput"
                        style={styles.textInputStylePhone}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : "#D3D3D3"}
                        {...custom}
                    />
                </View>
            </View>
        );
    }

    renderCountryCode(countryCode, onCountryCodeSelected) {
        return (
            <View style={{ width: "40%", justifyContent: "flex-start", borderRightWidth: 1, borderRightColor: "#E0E0E0", marginRight: 12 }}>
                <CountryPicker
                    onSelect={(value)=> onCountryCodeSelected({country: value, cca2: value.cca2})}
                    countryCode={countryCode}
                    withFilter
                    withFlag
                    withAlphaFilter
                    withCallingCode
                    cca2={countryCode}
                    renderFlagButton={(props) => this.renderFlagButton(props, countryCode)}
                />
            </View>
        );
    }

    render() {
        const { inputTitle, placeholderTextColor, ...custom } = this.props;
        const isPhoneNumber = inputTitle == "Phone Number";
        if (isPhoneNumber) {
            return this.renderPhoneInput();
        }
        return (
            <View style={styles.containerStyle}>
                {this.renderInputTitle()} 
                <View style={styles.textInputContainerStyle}>
                    <TextInput 
                        ref="textInput"
                        style={styles.textInputStyle}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : "#D3D3D3"}
                        {...custom}
                    />
                </View>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: "flex",
        width: "100%",
        marginTop: 40
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        width: "100%",
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 3,
        height: 42,
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    textInputContainerStylePhone: {
        flexDirection: 'row',
        flowGrow: 1,
        width: "100%",
        marginTop: 6,
        borderWidth: 1,
        borderColor: "#E0E0E0",
        borderRadius: 3,
        height: 42,
        paddingLeft: 16,
        paddingRight: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    textInputStyle: {
        width: "100%",
        fontSize: GM_FONT_SIZE.FONT_3,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
        marginTop: 0
    },
    textInputStylePhone: {
        width: "60%",
        fontSize: GM_FONT_SIZE.FONT_3,
        fontFamily: GM_FONT_FAMILY.GOTHAM,
        lineHeight: GM_FONT_LINE_HEIGHT.FONT_3,
        marginTop: 0
    }
};

export default InputBox;