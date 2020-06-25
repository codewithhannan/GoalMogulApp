/**
 * ********************************************************
 * FILENAME: ToogleField.js    TYPE: Context Provider
 *
 * DESCRIPTION:
 *      Form field component with a label and a toggle.
 *
 * AUTHER: Yanxiang Lan     START DATE: 25 June 20
 * UTILIZES: UI Kitten
 * *********************************************************
 *
 * @format
 * @see https://akveo.github.io/react-native-ui-kitten/docs/
 */

import React from 'react'
import { StyleSheet } from 'react-native'
import { Layout, Text } from '@ui-kitten/components'

function ToggleField({ label }) {
    return (
        <Layout>
            <Text>{label}</Text>
        </Layout>
    )
}

const styles = StyleSheet.create({})

export default ToggleField
