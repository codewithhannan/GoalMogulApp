/**
 * User agreement checkbox for EULA
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { default_style, color } from '../../styles/basic'
import { CheckBox } from '@ui-kitten/components'
import { Actions } from 'react-native-router-flux'
import DelayedButton from '../Common/Button/DelayedButton'

const UserAgreementCheckBox = ({ checked, onPress, isAutoAccepted }) => {
    const leadingText = isAutoAccepted
        ? `By signing up agree to the`
        : `I agree to the`
    return (
        <DelayedButton
            style={{
                backgroundColor: 'white',
                borderColor: 'lightgray',
                borderRadius: 4,
                borderWidth: isAutoAccepted ? 0 : 0.5,
                flexDirection: 'row',
                // marginTop: 24,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={() => onPress(!checked)}
        >
            {isAutoAccepted ? null : (
                <CheckBox checked={checked} onChange={onPress} />
            )}
            <Text
                style={[
                    default_style.subTitleText_1,
                    { fontSize: 12, paddingLeft: 15 },
                ]}
            >
                {leadingText}
            </Text>
            <Text
                style={[
                    default_style.subTitleText_1,
                    {
                        fontSize: 12,
                        paddingVertical: 15,
                        paddingHorizontal: 4,
                        color: color.GM_BLUE,
                    },
                ]}
                onPress={() => {
                    Actions.push('user_agreement')
                }}
            >
                Terms of Service
            </Text>
        </DelayedButton>
    )
}

export default UserAgreementCheckBox
