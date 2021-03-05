/**
 * ********************************************************
 * FILENAME: ThemeProvider.js    TYPE: Context Provider
 *
 * DESCRIPTION:
 *      Global UI theme provider for Goal Mogual applications.
 *
 * AUTHER: Yanxiang Lan     START DATE: 20 June 20
 * UTILIZES: UI Kitten
 * *********************************************************
 *
 * @format
 * @see https://akveo.github.io/react-native-ui-kitten/docs/
 */

import React from 'react'
import * as eva from '@eva-design/eva'
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import { MaterialCommunityIcons } from '../src/asset/icons/MaterialCommunityIcons'
import { MaterialIcons } from '../src/asset/icons/MaterialIcons'

/*
 * There are a lot more customizations that we can do with the
 * UI kitten theme.
 * Please consult https://akveo.github.io/react-native-ui-kitten/docs/guides/branding.
 */
import { default as theme } from './theme.json'
import { default as mapping } from './mapping.json'

function ThemeProvider({ children }) {
    return (
        <>
            <IconRegistry
                icons={[EvaIconsPack, MaterialIcons, MaterialCommunityIcons]}
            />
            <ApplicationProvider
                {...eva}
                theme={{ ...eva.light, ...theme }}
                customMapping={mapping}
            >
                {children}
            </ApplicationProvider>
        </>
    )
}

export default ThemeProvider
