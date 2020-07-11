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
        if (topGoals && topGoals.length !== 0) {
            text = topGoals[0]
            title = 'Top Goal: '
        }

        if (headline) {
            title = 'Headline: '
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
        if (!title || !text) {
            return <View style={{ marginTop: 20 }} />
        }

        return (
            <View style={styles.goalContainerStyle}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[DEFAULT_STYLE.normalText_1, { marginBottom: 2 }]}
                >
                    <Text style={{ fontWeight: 'bold', color: GM_BLUE }}>
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
        marginBottom: 9,
    },
}

export default UserTopGoals
