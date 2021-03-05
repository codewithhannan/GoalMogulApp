/**
 * This is the header summary text.
 * For NeedCard, Someone requested help from you for a need
 * For GoalCard, Someone shared a goal with you
 *
 * @format
 */

import React from 'react'
import { Text, View } from 'react-native'

const renderText = (item) => {
    const { owner } = item
    const { boldTextStyle, textStyle } = styles
    const nameComponent =
        owner && owner.name ? (
            <Text style={{ ...boldTextStyle, ...textStyle }}>
                {owner.name}{' '}
            </Text>
        ) : null

    const goalHeaderText = <Text style={styles.textStyle}>shared a goal</Text>

    const needHeaderText = (
        <Text style={styles.textStyle}>requested help from you for a need</Text>
    )

    const headerText = goalHeaderText

    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
            }}
        >
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    color: 'black',
                    fontSize: 10,
                }}
            >
                {nameComponent}
                {headerText}
            </Text>
        </View>
    )
}

const GoalCardHeader = (props) => {
    const { item } = props
    if (!item) return null

    return (
        <View
            style={{
                marginBottom: 1,
                backgroundColor: 'transparent',
                padding: 5,
                paddingLeft: 12,
                paddingRight: 12,
                borderBottomColor: '#F8F8F8',
                borderBottomWidth: 1,
            }}
        >
            {renderText(item)}
        </View>
    )
}

const styles = {
    boldTextStyle: {
        fontWeight: '700',
        color: '#6d6d6d',
    },
    textStyle: {
        fontSize: 9,
        color: '#6d6d6d',
    },
}

export default GoalCardHeader
