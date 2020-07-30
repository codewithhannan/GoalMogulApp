/** @format */

import React from 'react'
import _ from 'lodash'
import { View, Text } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import { FONT_FAMILY_3 } from '../../../styles'
import OnboardingStyles from '../../../styles/Onboarding'
import DelayedButton from '../../Common/Button/DelayedButton'
import { Input } from '@ui-kitten/components'

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

        return (
            <DelayedButton style={{ flexDirection: 'row' }} onPress={onOpen}>
                {/* <Flag countryCode={countryCode.cca2} flagSize={14} /> */}
                {/* <Text
                    style={[DEFAULT_STYLE.titleText_2]}
                >{`${countryCode.cca2} `}</Text> */}
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
    shouldComponentUpdate(nextProps, nextState) {
        const {
            value,
            caption,
            countryCode,
            meta,
            input,
            disabled,
        } = this.props

        return (
            !_.isEqual(value, nextProps.value) ||
            !_.isEqual(caption, nextProps.caption) ||
            !_.isEqual(countryCode, nextProps.countryCode) ||
            !_.isEqual(meta, nextProps.meta) || // meta is from redux form
            !_.isEqual(input, nextProps.input) || // meta is from redux form
            !_.isEqual(disabled, nextProps.disabled)
        )
    }

    focus() {
        this.refs['textInput'].focus()
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
        const { inputTitle, optional } = this.props
        if (optional) {
            return (
                <Text
                    style={[OnboardingStyles.input.title, { marginBottom: 5 }]}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontFamily: FONT_FAMILY_3,
                        }}
                    >
                        {inputTitle}
                    </Text>
                    <Text> (Optional)</Text>
                </Text>
            )
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                <Text
                    style={[OnboardingStyles.input.title, { marginBottom: 5 }]}
                >
                    <Text style={{ color: 'red' }}>*</Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontFamily: FONT_FAMILY_3,
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
                    style={{ backgroundColor: 'white' }}
                    textStyle={[OnboardingStyles.input.text]}
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
                    withAlphaFilter
                    withCallingCode
                    cca2={countryCode}
                    renderFlagButton={(props) =>
                        this.renderFlagButton(props, countryCode)
                    }
                />
            </View>
        )
    }

    render() {
        const { inputTitle, errorText, meta, input, ...custom } = this.props
        const isPhoneNumber = inputTitle == 'Phone Number'
        if (isPhoneNumber) {
            return this.renderPhoneInput()
        }

        // Redux form adapter
        if (input && meta) {
            const { status, caption } = custom
            const { onChange, ...restInput } = input
            let statusToUse = status
            let captionToUse = caption

            if (meta && meta.error) {
                statusToUse = 'danger'
                captionToUse = meta.error
            }

            return (
                <View style={styles.containerStyle}>
                    <Input
                        {...custom}
                        {...restInput}
                        onChangeText={onChange}
                        status={statusToUse}
                        caption={captionToUse}
                        ref="textInput"
                        label={this.renderInputTitle}
                        style={{ width: '100%', backgroundColor: 'white' }}
                        textStyle={[OnboardingStyles.input.text]}
                        size="large"
                    />
                </View>
            )
        }

        // Normal ui-kitten input
        return (
            <View style={styles.containerStyle}>
                <Input
                    {...custom}
                    ref="textInput"
                    label={this.renderInputTitle}
                    style={{ width: '100%', backgroundColor: 'white' }}
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
}

export default InputBox
