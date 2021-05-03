/** @format */

import { AlphabetList } from 'react-native-section-alphabet-list'
import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const data = [
    { value: 'Lillie-Mai Allen', key: 'lCUTs2', image: '123' },
    { value: 'Emmanuel Goldstein', key: 'TXdL0c', image: '123' },
    { value: 'Winston Smith', key: 'zqsiEw', image: '123' },
    { value: 'William Blazkowicz', key: 'psg2PM', image: '123' },
    { value: 'Philip Ravelston', key: 'NVHSkA', image: '123' },
    { value: 'Rosemary Waterlow', key: 'SaHqyG', image: '123' },
    { value: 'Julia Comstock', key: 'iaT1Ex', image: '123' },
    { value: 'Mihai Maldonado', key: 'OvMd5e', image: '123' },
    { value: 'Murtaza Molina', key: '25zqAO', image: '123' },
    { value: 'Peter Petigrew', key: '8cWuu3', image: '123' },
]

class TestModal extends Component {
    state = {}
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <AlphabetList
                    data={data}
                    indexLetterStyle={{
                        color: 'blue',
                        fontSize: 15,
                    }}
                    renderCustomItem={(item) => (
                        <View style={styles.listItemContainer}>
                            <Text style={styles.listItemLabel}>
                                {item.value}
                            </Text>
                            <Text>{item.image}</Text>
                        </View>
                    )}
                    renderCustomSectionHeader={(section) => (
                        <View style={styles.sectionHeaderContainer}>
                            <Text style={styles.sectionHeaderLabel}>
                                {section.title}
                            </Text>
                        </View>
                    )}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})

export default TestModal
