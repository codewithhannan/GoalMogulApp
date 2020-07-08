/**
 * Materical Icons from
 * @see https://oblador.github.io/react-native-vector-icons/
 *
 * Sample usage:
 * import { Icon } from '@ui-kitten/components'
 *
 * # Find icons in https://oblador.github.io/react-native-vector-icons/
 * # under section MaterialIcons
 * <Icon name='{icon name just found}' pack='material' style={{ height, width, tintColor }} />
 * @format
 */

import React from 'react'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export const MaterialIcons = {
    name: 'material',
    icons: createIconsMap(),
}

function createIconsMap() {
    return new Proxy(
        {},
        {
            get(target, name) {
                return IconProvider(name)
            },
        }
    )
}

const IconProvider = (name) => ({
    toReactElement: (props) => MaterialIcon({ name, ...props }),
})

function MaterialIcon({ name, style }) {
    const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style)
    return (
        <Icon name={name} size={height} color={tintColor} style={iconStyle} />
    )
}
