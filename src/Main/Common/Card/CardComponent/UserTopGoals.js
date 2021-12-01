/** @format */

import React from 'react'
import { View, Text } from 'react-native'
import DelayedButton from '../../Button/DelayedButton'
import { color, default_style } from '../../../../styles/basic'

class UserTopGoals extends React.PureComponent {
    /**
     * Return two text, { title, text }.
     * If top goal exists, then title is "Top Goal: ", otherwise, title is "Headline: "
     */
    getText = (user) => {
        // Depends on the page, currently PYMK page has a list of Goals, where memberList it only has 1 topGoal
        const { topGoals, headline, topGoal } = user
        let title // title to display
        let text // text to display
        if (topGoal && topGoal.trim().length) {
            text = topGoal
            title = 'Goals: '
        } else if (topGoals && topGoals.length) {
            text = topGoals[0]
            if (topGoals.length > 1) {
                text = topGoals[0] + ', ' + topGoals[1]
            }
            title = 'Goals: '
        } else if (headline && headline.trim().length) {
            title = '' // Don't render the prefix "Headline: ..." for headline
            text = headline
        }

        return {
            title,
            text,
        }
    }

    getNeeds = (user) => {
        const { topNeeds } = user
        let Needs_title
        let Needs_text
        if (topNeeds && topNeeds.length) {
            Needs_text = topNeeds[0]
            if (topNeeds.length > 1) {
                Needs_text = topNeeds[0] + ', ' + topNeeds[1]
            }
            Needs_title = 'Needs: '
        }
        return {
            Needs_title,
            Needs_text,
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

        const { Needs_text, Needs_title } = this.getNeeds(user)
        console.log('top needs', text)
        // if (!Needs_title && !Needs_text) {
        //     return null
        // }

        return (
            <>
                <View style={[styles.goalContainerStyle, this.props.style]}>
                    <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[default_style.normalText_1]}
                    >
                        <Text
                            style={[
                                default_style.titleText_2,
                                { color: color.GM_BLUE },
                            ]}
                        >
                            {title}
                        </Text>
                        {text}
                    </Text>
                </View>
                {Needs_text !== undefined ? (
                    <View style={[styles.goalContainerStyle, this.props.style]}>
                        <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[default_style.normalText_1]}
                        >
                            <Text
                                style={[
                                    default_style.titleText_2,
                                    { color: color.GM_BLUE },
                                ]}
                            >
                                {Needs_title}
                            </Text>
                            {Needs_text}
                        </Text>
                    </View>
                ) : null}
            </>
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
