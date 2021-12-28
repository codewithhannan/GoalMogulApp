/** @format */

import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { HEADER_STYLES } from '../../styles/Header'
import { Searchbar } from 'react-native-paper'

export default function AccountabilityBuddies() {
    return (
        <>
            <View style={styles.headerStyle}>
                <Text style={styles.titleTextStyle}>
                    Accountability Buddies
                </Text>
            </View>
            <View style={{ top: 30, width: '90%', alignSelf: 'center' }}>
                <Searchbar placeholder="Search" />
                <TouchableOpacity
                    onPress={() => Actions.push('holding')}
                    style={{
                        width: '100%',
                        top: 50,
                        height: 50,
                        backgroundColor: '#45C9F6',
                    }}
                >
                    <Text
                        style={[styles.titleTextStyle, styles.titleTextStyles]}
                    >
                        Holding Me Accountable
                    </Text>
                    <Text style={[styles.titleTextStyle, styles.titles]}>
                        {'>'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => Actions.push('holdingAccountable')}
                    style={{
                        width: '100%',
                        top: 70,
                        height: 50,
                        backgroundColor: '#45C9F6',
                    }}
                >
                    <Text
                        style={[styles.titleTextStyle, styles.titleTextStyles]}
                    >
                        I'm Holding Accountable
                    </Text>
                    <Text style={[styles.titleTextStyle, styles.titles]}>
                        {'>'}
                    </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}
const styles = {
    headerStyle: {
        ...HEADER_STYLES.headerContainer,
        justifyContent: 'center',
    },

    titleTextStyle: HEADER_STYLES.title,
    titleTextStyles: {
        top: 15,
        left: 20,
    },
    titles: { left: 300, bottom: 13, fontSize: 22 },
}
