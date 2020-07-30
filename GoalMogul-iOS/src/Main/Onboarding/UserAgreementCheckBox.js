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

const UserAgreementCheckBox = ({ checked, onPress }) => {
    return (
        <DelayedButton
            style={{
                backgroundColor: 'white',
                borderColor: 'lightgray',
                borderRadius: 4,
                borderWidth: 0.5,
                flexDirection: 'row',
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={() => onPress(!checked)}
        >
            <CheckBox checked={checked} onChange={onPress} />
            <Text
                style={[
                    default_style.subTitleText_1,
                    { fontSize: 15, paddingLeft: 15 },
                ]}
            >
                I agree to the
            </Text>
            <Text
                style={[
                    default_style.subTitleText_1,
                    {
                        fontSize: 15,
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
