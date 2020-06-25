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
import { Layout, Text, Toggle } from '@ui-kitten/components'

/**
 * REQUIRED PROPS:
 * * string     label
 * * boolean    checked
 *
 * OPTIONAL PROPS:
 * * function   onCheckedChange
 * * children   component to be displayed beside label
 */
function ToggleField(props) {
    const { label, checked, children, onCheckedChange, style } = props
    return (
        <Layout style={[styles.container, style]} {...props}>
            <Layout style={styles.label}>
                <Text>{label}</Text>
                {children}
            </Layout>
            <Toggle checked={checked} onCheckedChange={onCheckedChange} />
        </Layout>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    label: {
        flexDirection: 'row',
    },
})

export default ToggleField
