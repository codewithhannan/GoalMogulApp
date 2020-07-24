/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import DelayedButton from '../../Common/Button/DelayedButton'
import { GM_BLUE, DEFAULT_STYLE } from '../../../styles'

class UserTopGoals extends React.PureComponent {
    /**
     * Return two text, { title, text }.
     * If top goal exists, then title is "Top Goal: ", otherwise, title is "Headline: "
     */
    getText = (user) => {
        const { topGoals, headline } = user
        let title // title to display
        let text // text to display
        if (topGoals && topGoals.length) {
            text = topGoals[0]
            title = 'Top Goal: '
        } else if (headline && headline.trim().length) {
            title = '' // Don't render the prefix "Headline: ..." for headline
            text = headline
        }

        return {
            title,
            text,
        }
    }

    render() {
        const { user } = this.props
        if (!user) {
            return null
        }

        const { text, title } = this.getText(user)
        if (!title && !text) {
            return null
        }

        return (
            <View style={styles.goalContainerStyle}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[DEFAULT_STYLE.normalText_1]}
                >
                    <Text
                        style={[DEFAULT_STYLE.titleText_2, { color: GM_BLUE }]}
                    >
                        {title}
                    </Text>
                    {text}
                </Text>
            </View>
        )
    }
}

const styles = {
    goalContainerStyle: {
        flexDirection: 'row',
        flex: 1,
        marginTop: 8,
        marginLeft: 49, // image width 42 + name margin left 7 from UserCardHeader.js
    },
}

export default UserTopGoals
