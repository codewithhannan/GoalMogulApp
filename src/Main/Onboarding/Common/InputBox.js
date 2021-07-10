/** @format */

import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { text, color, default_style } from '../../../styles/basic'
import OnboardingStyles from '../../../styles/Onboarding'

import DelayedButton from '../../Common/Button/DelayedButton'
import { Input, Icon } from '@ui-kitten/components'
import { FONT_FAMILY } from '../../../styles/basic/text'

const MIN_AGE_REQUIREMENT_YRS = 13

class CountryFlagButton extends React.Component {
    // TODO: improve the flag reloading
    // shouldComponentUpdate(nextProps, nextState) {
    //     const { countryCode } = this.props
    //     console.log('this.props: ', countryCode)
    //     console.log('next props: ', nextProps.countryCode)
    //     return !_.isEqual(countryCode, nextProps.countryCode)
    // }

    render() {
        const { countryCode, onOpen } = this.props
        const callingCode =
            countryCode.country &&
            countryCode.country.callingCode &&
            !_.isEmpty(countryCode.country.callingCode)
                ? countryCode.country.callingCode[0]
                : 0

        console.log('Country Codee', callingCode)

        return (
            <DelayedButton style={{ flexDirection: 'row' }} onPress={onOpen}>
                <Text style={[OnboardingStyles.text.subTitle_2]}>
                    +{`${callingCode}`}
                </Text>
            </DelayedButton>
        )
    }
}

/**
 * Onboarding flow Input Box
 *
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 */
class InputBox extends React.Component {
    state = {
        isDatePickerVisible: false,
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {
            value,
            caption,
            countryCode,
            meta,
            input,
            disabled,
            selectedValue,
        } = this.props
        const { isDatePickerVisible } = this.state

        return (
            !_.isEqual(value, nextProps.value) ||
            !_.isEqual(caption, nextProps.caption) ||
            !_.isEqual(countryCode, nextProps.countryCode) ||
            !_.isEqual(meta, nextProps.meta) || // meta is from redux form
            !_.isEqual(input, nextProps.input) || // meta is from redux form
            !_.isEqual(disabled, nextProps.disabled) ||
            !_.isEqual(selectedValue, nextProps.selectedValue) ||
            !_.isEqual(isDatePickerVisible, nextState.isDatePickerVisible)
        )
    }

    focus() {
        this.refs['textInput'].focus()
    }

    renderDateTimePicker() {
        const {
            inputTitle,
            caption,
            value,
            onChangeText,
            containerStyle,
            status,
        } = this.props
        return (
            <View style={[{ marginTop: 20 }, containerStyle || {}]}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={[
                            styles.labelStyle,
                            {
                                color: 'red',
                            },
                        ]}
                    >
                        *
                    </Text>
                    <Text style={styles.labelStyle}>{inputTitle}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        // height: 40 * default_style.uiScale,
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 3,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        marginTop: 4,
                    }}
                    onPress={() =>
                        this.setState({
                            ...this.state,
                            isDatePickerVisible: true,
                        })
                    }
                >
                    <View
                        style={{
                            height: 48,
                            width: 34 * default_style.uiScale,
                            borderRightWidth: 1,
                            borderColor: '#DFE0E1',
                            backgroundColor: '#F5F7FA',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Icon
                            name="calendar-blank-outline"
                            pack="material-community"
                            style={[
                                default_style.buttonIcon_1,
                                { tintColor: '#DADADA' },
                            ]}
                        />
                    </View>
                    <Text
                        style={[
                            default_style.subTitleText_1,
                            {
                                marginLeft: 12,
                                marginRight: 12,
                                paddingVertical: 12,
                            },
                        ]}
                    >
                        {value ? moment(value).format('ll') : 'Date of Birth'}
                    </Text>
                </TouchableOpacity>

                {/** Date time picker on date touchable is clicked */}
                <DateTimePicker
                    isVisible={this.state.isDatePickerVisible}
                    mode="date"
                    // pickerStyleIOS={{
                    //     height: 80,
                    //     bottom: 60,
                    //     marginHorizontal: 20,
                    // }}
                    // pickerContainerStyleIOS={{
                    //     justifyContent: 'center',
                    // }}
                    display="calendar"
                    titleIOS="Date of Birth"
                    maximumDate={moment()
                        .subtract(MIN_AGE_REQUIREMENT_YRS, 'year')
                        .toDate()} // maximum is set to 13 years from now to cap age at least 13 years old
                    date={
                        value
                            ? value
                            : moment()
                                  .subtract(MIN_AGE_REQUIREMENT_YRS, 'year')
                                  .toDate()
                    }
                    onConfirm={(date) =>
                        this.setState(
                            {
                                isDatePickerVisible: false,
                            },
                            () => onChangeText(date)
                        )
                    }
                    onCancel={() =>
                        this.setState({
                            isDatePickerVisible: false,
                        })
                    }
                    isDarkModeEnabled={false}
                />
                {this.renderCaption(caption, status)}
            </View>
        )
    }

    renderFlagButton(props, countryCode) {
        return (
            <CountryFlagButton
                onOpen={props.onOpen}
                countryCode={countryCode}
            />
        )
    }

    renderInputTitle = () => {
        const { inputTitle, optional, hideRedStar } = this.props
        if (optional) {
            return (
                <Text
                    style={[OnboardingStyles.input.title, { marginBottom: 5 }]}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                        }}
                    >
                        {inputTitle}
                    </Text>
                    <Text
                        style={{
                            fontSize: 12,
                            color: color.GM_MID_GREY,
                        }}
                    >
                        {' '}
                        (Optional)
                    </Text>
                </Text>
            )
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={[OnboardingStyles.input.title, { marginBottom: 5 }]}
                >
                    {!hideRedStar && <Text style={{ color: 'red' }}>*</Text>}
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                        }}
                    >
                        {inputTitle}
                    </Text>
                </Text>
            </View>
        )
    }

    renderPhoneInput() {
        const {
            inputTitle,
            placeholderTextColor,
            onCountryCodeSelected,
            countryCode,
            caption,
            status,
            ...custom
        } = this.props

        return (
            <View style={styles.containerStyle}>
                <Input
                    ref="textInput"
                    label={this.renderInputTitle}
                    size="large"
                    accessoryLeft={() =>
                        this.renderCountryCode(
                            countryCode,
                            onCountryCodeSelected
                        )
                    }
                    style={{ backgroundColor: color.GM_CARD_BACKGROUND }}
                    textStyle={[OnboardingStyles.input.text]}
                    caption={this.renderCaption(caption, status)}
                    status={status}
                    keyboardType="number-pad"
                    {...custom}
                />
            </View>
        )
    }

    renderCountryCode = (countryCode, onCountryCodeSelected) => {
        return (
            <View
                style={{
                    justifyContent: 'flex-start',
                    borderRightWidth: 1,
                    borderRightColor: '#E0E0E0',
                    marginRight: 12,
                    paddingRight: 8,
                }}
            >
                <CountryPicker
                    onSelect={(value) =>
                        onCountryCodeSelected({
                            country: value,
                            cca2: value.cca2,
                        })
                    }
                    countryCode={countryCode}
                    withFilter
                    withFlag
                    withCallingCode
                    withFlagButton={true}
                    cca2={countryCode}
                    renderFlagButton={(props) =>
                        this.renderFlagButton(props, countryCode)
                    }
                />
            </View>
        )
    }

    renderGenderSelection() {
        const {
            inputTitle,
            caption,
            value,
            onChangeText,
            containerStyle,
            status,
        } = this.props
        return (
            <View style={[styles.containerStyle, containerStyle || {}]}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text
                        style={[
                            styles.labelStyle,
                            {
                                color: 'red',
                            },
                        ]}
                    >
                        *
                    </Text>
                    <Text style={styles.labelStyle}>{inputTitle}</Text>
                </View>
                <ScrollView
                    horizontal
                    contentContainerStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 4,
                    }}
                >
                    {this.renderPill('Male', value, onChangeText)}
                    {this.renderPill('Female', value, onChangeText)}
                    {this.renderPill('Other', value, onChangeText)}
                    {this.renderPill('Prefer not to say', value, onChangeText)}
                </ScrollView>
                {this.renderCaption(caption, status)}
            </View>
        )
    }

    renderPrivacySelection() {
        const {
            inputTitle,
            caption,
            selectedValue,
            onChangeText,
            containerStyle,
            status,
            privacyOptions,
        } = this.props
        return (
            <View style={[styles.containerStyle, containerStyle || {}]}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <Text style={styles.labelStyle}>{inputTitle}</Text>
                </View>
                <ScrollView
                    horizontal
                    contentContainerStyle={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 4,
                        paddingTop: 8,
                    }}
                    showsHorizontalScrollIndicator={false}
                >
                    {privacyOptions.map(
                        ({ value, text, materialCommunityIconName }) =>
                            this.renderPill(
                                value,
                                selectedValue,
                                onChangeText,
                                text,
                                materialCommunityIconName
                            )
                    )}
                </ScrollView>
                {caption || status ? this.renderCaption(caption, status) : null}
            </View>
        )
    }

    renderCaption(caption, status) {
        return (
            <Text
                style={[
                    styles.captionStyle,
                    status == 'danger' ? styles.dangerCaptionStyle : {},
                ]}
            >
                {caption}
            </Text>
        )
    }

    renderPill(pillKind, selectedValue, onChangeText, maybePillText, icon) {
        return (
            <DelayedButton
                touchableWithoutFeedback
                onPress={() => onChangeText(pillKind)}
            >
                <View
                    style={[
                        styles.pillStyle,
                        selectedValue == pillKind
                            ? styles.pillSelectedStyle
                            : {},
                    ]}
                >
                    {icon && (
                        <Icon
                            pack="material-community"
                            name={icon}
                            style={{
                                height: 15,
                                width: 15,
                                tintColor: '#828282',
                                marginHorizontal: 5,
                            }}
                        />
                    )}
                    <Text
                        style={[
                            default_style.buttonText_1,
                            {
                                color: color.GM_MID_GREY,
                                fontSize: 12,
                            },
                        ]}
                    >
                        {maybePillText ? maybePillText : pillKind}
                    </Text>
                </View>
            </DelayedButton>
        )
    }

    render() {
        const {
            inputTitle,
            errorText,
            meta,
            input,
            containerStyle,
            status,
            caption,
            ...custom
        } = this.props
        const isPhoneNumber = inputTitle == 'Phone Number'
        if (isPhoneNumber) {
            return this.renderPhoneInput()
        }
        const isGenderSelection = inputTitle == 'Gender'
        if (isGenderSelection) {
            return this.renderGenderSelection()
        }
        const isPrivacySelection = inputTitle == 'Privacy'
        if (isPrivacySelection) {
            return this.renderPrivacySelection()
        }
        const isDateOfBirth = inputTitle == 'Date of birth'
        if (isDateOfBirth) {
            return this.renderDateTimePicker()
        }

        // Redux form adapter
        if (input && meta) {
            const { onChange, ...restInput } = input
            let statusToUse = status
            let captionToUse = caption

            if (meta && meta.error) {
                statusToUse = 'danger'
                captionToUse = meta.error
            }
            return (
                <View style={[styles.containerStyle, containerStyle || {}]}>
                    <Input
                        {...custom}
                        {...restInput}
                        onChangeText={onChange}
                        status={statusToUse}
                        caption={this.renderCaption(captionToUse, statusToUse)}
                        ref="textInput"
                        label={this.renderInputTitle}
                        style={{
                            width: '100%',
                            backgroundColor: color.GM_CARD_BACKGROUND,
                            ...(custom.inputStyle ? custom.inputStyle : {}),
                        }}
                        textStyle={[OnboardingStyles.input.text]}
                        size="large"
                    />
                </View>
            )
        }

        // Normal ui-kitten input
        return (
            <View style={[styles.containerStyle, containerStyle || {}]}>
                <Input
                    {...custom}
                    ref="textInput"
                    label={this.renderInputTitle}
                    style={{
                        width: '100%',
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        ...(custom.inputStyle ? custom.inputStyle : {}),
                    }}
                    status={status}
                    caption={this.renderCaption(caption, status)}
                    textStyle={[OnboardingStyles.input.text]}
                    size="large"
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        display: 'flex',
        width: '100%',
        marginTop: 20,
    },
    pillStyle: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginRight: 8,
        borderColor: color.GM_DOT_GRAY,
        borderWidth: 0.5,
        borderRadius: 50,

        flexWrap: 'wrap',
        flexDirection: 'row',
    },
    pillSelectedStyle: {
        backgroundColor: color.GM_LIGHT_GRAY,
        borderColor: color.GM_MID_GREY,
    },
    labelStyle: {
        fontSize: 15,
        fontFamily: FONT_FAMILY.SEMI_BOLD,
        color: '#828282',
        marginHorizontal: 5,
    },
    captionStyle: {
        fontSize: 12,
        paddingVertical: 4,
        color: color.GM_MID_GREY,
        fontFamily: FONT_FAMILY.REGULAR,
    },
    dangerCaptionStyle: {
        color: 'red',
    },
}

export default InputBox
