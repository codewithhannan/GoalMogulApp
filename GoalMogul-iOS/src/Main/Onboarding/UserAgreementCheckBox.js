/**
 * User agreement checkbox for EULA
 *
 * @format
 */

import React from 'react'
import { View, Text } from 'react-native'
import { DEFAULT_STYLE, GM_BLUE } from '../../styles'
import { CheckBox } from '@ui-kitten/components'
import { Actions } from 'react-native-router-flux'

const UserAgreementCheckBox = ({ checked, onPress }) => {
    return (
        <View
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
        >
            <CheckBox checked={checked} onChange={onPress} />
            <Text
                style={[
                    DEFAULT_STYLE.subTitleText_1,
                    { fontSize: 15, paddingLeft: 15 },
                ]}
            >
                I agree to the
            </Text>
            <Text
                style={[
                    DEFAULT_STYLE.subTitleText_1,
                    {
                        fontSize: 15,
                        paddingVertical: 15,
                        paddingHorizontal: 4,
                        color: GM_BLUE,
                    },
                ]}
                onPress={() => {
                    Actions.push('user_agreement')
                }}
            >
                Terms of Service (EULA)
            </Text>
        </View>
    )
}

export default UserAgreementCheckBox
