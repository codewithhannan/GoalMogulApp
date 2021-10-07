/** @format */

// This component is the card header
// For example, Jia created a comment for Goal
import React from 'react'
import _ from 'lodash'
import { Text, View } from 'react-native'
import { switchCase, isSharedPost } from '../../redux/middleware/utils'
import { default_style, text } from '../../styles/basic'

class ActivitySummary extends React.Component {
    renderText(item) {
        const { boldTextStyle, textStyle } = styles
        const {
            action, // ['Create', 'Update']
            actionDetails, // ['GoalComplete', 'GoalShare'],
            actor,
            actedWith, // ['Comment', 'Goal', 'Post', 'Like']
            actedUponEntityType, // ['Goal', 'Post']
            belongsToTribe,
            belongsToEvent,
            postRef,
        } = item

        const tribeText = belongsToTribe ? (
            <Text>
                <Text style={{ ...boldTextStyle }}> {belongsToTribe.name}</Text>{' '}
                Tribe
            </Text>
        ) : null
        const eventText = belongsToEvent ? (
            <Text>
                <Text style={{ ...boldTextStyle }}>
                    {' '}
                    {belongsToEvent.title}
                </Text>{' '}
                Event
            </Text>
        ) : null
        const actorText = (
            <Text style={{ ...boldTextStyle, ...textStyle }}>
                {actor && actor.name}{' '}
            </Text>
        )
        const text = getSummaryText({
            Create: {
                Goal: (val) => {
                    if (actionDetails && actionDetails === 'GoalShare') {
                        return `shared a ${val.actedWith}`
                    }
                    return `shared a ${val.actedWith}`
                },
                Post: (val) => {
                    // console.log('POSTTTT VALUEEE', val)
                    if (!val.postRef && !val.postRef.postType) return ''
                    if (!isSharedPost(val.postRef.postType)) {
                        return (
                            `shared an Update ` +
                            `${
                                val.belongsToEvent || val.belongsToTribe
                                    ? 'in'
                                    : ''
                            }`
                        )
                    }
                    return (
                        `shared ${switchPostType(val.postRef.postType)} ` +
                        `${
                            val.belongsToEvent || val.belongsToTribe ? 'to' : ''
                        }`
                    )
                },
                Step: (val) => {
                    if (!val.postRef && !val.postRef.postType) return ''
                    if (!isSharedPost(val.postRef.postType)) {
                        return `completed steps for a Goal`
                    }
                    return (
                        `shared ${switchPostType(val.postRef.postType)} ` +
                        `${
                            val.belongsToEvent || val.belongsToTribe ? 'to' : ''
                        }`
                    )
                },
                // NOTE: the clean approach is to change the backend that populate the field
                // actedUponEntityType from Post to Update
                Comment: (val) =>
                    `commented on ${
                        val.actedUponEntityType === 'Post'
                            ? 'an Update'
                            : `a ${val.actedUponEntityType}`
                    }`,
                Like: (val) =>
                    `liked ${
                        val.actedUponEntityType === 'Post'
                            ? 'an Update'
                            : `a ${val.actedUponEntityType}`
                    }`,
            },
            Update: {
                Goal: () => 'completed the goal',
            },
        })({ belongsToTribe, belongsToEvent, postRef })
            .do(action)
            .with(actedWith)
            .on(actedUponEntityType)

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
                        ...default_style.smallText_1,
                        flex: 1,
                        flexWrap: 'wrap',
                        color: '#6d6d6d',
                    }}
                >
                    {actorText}
                    {text}
                    {eventText}
                    {tribeText}
                </Text>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null

        // Do not show the summary if this is a badge award activity feed
        if (
            item &&
            _.get(item, 'postRef.milestoneCelebration.milestoneIdentifier') !==
                undefined
        )
            return null

        return (
            <View
                style={{
                    marginBottom: 0.5,
                    padding: 7,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderBottomColor: '#F2F2F2',
                    borderBottomWidth: 1,
                }}
            >
                {this.renderText(item)}
            </View>
        )
    }
}

const executeIfFunction = (f, values) => (f instanceof Function ? f(values) : f)
const switchNestCases = (cases) => (action) => (actedWith) => {
    const innerCases = cases.hasOwnProperty(action) ? cases[action] : {}
    return innerCases.hasOwnProperty(actedWith) ? innerCases[actedWith] : ''
}

const getSummaryText = (cases) => ({
    belongsToTribe,
    belongsToEvent,
    postRef,
}) => ({
    do(action) {
        return {
            with(actedWith) {
                return {
                    on(actedUponEntityType) {
                        return executeIfFunction(
                            switchNestCases(cases)(action)(actedWith),
                            {
                                action,
                                actedWith,
                                actedUponEntityType,
                                belongsToTribe,
                                belongsToEvent,
                                postRef,
                            }
                        )
                    },
                }
            },
        }
    },
})

const switchPostType = (postType) =>
    switchCase({
        ShareNeed: 'a need',
        SharePost: 'an update',
        ShareGoal: 'a goal',
        ShareUser: 'a user',
        ShareStep: 'a step',
    })('an update')(postType)

const styles = {
    boldTextStyle: {
        ...default_style.buttonText_2,
        fontFamily: text.FONT_FAMILY.SEMI_BOLD,
    },
    textStyle: {
        ...default_style.normalText_2,
    },
}

export default ActivitySummary
