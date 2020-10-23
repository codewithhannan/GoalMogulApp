/** @format */

import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import timeago from 'timeago.js'
import _ from 'lodash'
import { connect } from 'react-redux'

// Components
import ProfileImage from '../../Common/ProfileImage'
import Timestamp from '../../Goal/Common/Timestamp'
import DelayedButton from '../../Common/Button/DelayedButton'

// Assets
import bulb from '../../../asset/utils/bulb.png'
import forward from '../../../asset/utils/right_arrow.png'
import { Icon } from '@ui-kitten/components'

// Actions
import {
    openGoalDetail,
    openGoalDetailById,
} from '../../../redux/modules/home/mastermind/actions'
import { color, default_style, text } from '../../../styles/basic'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'
import { UI_SCALE } from '../../../styles'

// Constants
const DEBUG_KEY = '[ UI NotificationNeedCard ]'

class NotificationCard extends React.Component {
    /**
     * When light bulb icon is clicked, it opens goal details and then
     * Opens suggestion modal
     */
    handleOnSuggestion = (item) => {
        if (
            item !== null &&
            !_.isEmpty(item) &&
            item.goalRef !== null &&
            !_.isEmpty(item.goalRef)
        ) {
            const initialProps = {
                focusType: 'need',
                focusRef: item._id,
                // commentBox is passed in to GoalDetailCardV3 as initial
                // commentBox: true,
                initialShowSuggestionModal: true,
            }
            return this.props.openGoalDetailById(item.goalRef._id, initialProps)
        }
        console.warn(`${DEBUG_KEY}: invalid item: `, item)
    }

    /**
     * When light bulb icon is clicked, it opens goal details
     */
    handleOnOpen = (item) => {
        if (
            item !== null &&
            !_.isEmpty(item) &&
            item.goalRef !== null &&
            !_.isEmpty(item.goalRef)
        ) {
            const { _id } = item
            // console.log(`${DEBUG_KEY}: i am here with item:`, item);
            return this.props.openGoalDetail(item.goalRef, {
                focusType: 'need',
                focusRef: _id,
                initialShowSuggestionModal: false,
            })
        }
        console.warn(`${DEBUG_KEY}: invalid item: `, item)
    }

    renderProfileImage(item) {
        const { goalRef } = item
        return (
            <ProfileImage
                imageStyle={{ height: 50, width: 50 }}
                imageUrl={getProfileImageOrDefaultFromUser(goalRef.owner)}
                rounded
            />
        )
    }

    renderNeed(item) {
        const { created, description, goalRef } = item

        // TODO: use the actual content
        const goalTitle = _.get(goalRef, 'title', null)
        const name = goalRef.owner.name

        return (
            <View style={{ flex: 1, marginLeft: 10 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginRight: 4,
                    }}
                >
                    <Text
                        style={[
                            {
                                flexWrap: 'wrap',
                                color: color.TEXT_COLOR.OFF_DARK,
                                fontSize: 14 * UI_SCALE,
                                textAlign: 'center',
                                fontFamily: text.FONT_FAMILY.REGULAR,
                            },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        <Text
                            style={[
                                default_style.titleText_2,
                                { color: color.TEXT_COLOR.OFF_DARK },
                            ]}
                        >
                            {name}
                            {': '}
                        </Text>
                        {description}
                    </Text>
                    <Icon
                        pack="material-community"
                        style={[default_style.buttonIcon_1, { height: 16 }]}
                        name="menu-right"
                    />
                </View>
                <Text
                    style={[
                        default_style.titleText_2,
                        {
                            color: color.TEXT_COLOR.OFF_DARK,
                            flexWrap: 'wrap',
                            marginVertical: 4,
                        },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {goalTitle}
                </Text>
                <View style={{ marginBottom: 3 }}>
                    <Timestamp time={timeago().format(created)} />
                </View>
            </View>
        )
    }

    renderActionIcons(item) {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    marginLeft: 2,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        ...styles.iconContainerStyle,
                        backgroundColor: '#FFFAEC',
                    }}
                    onPress={() => this.handleOnSuggestion(item)}
                >
                    <Icon
                        name="lightbulb-on-outline"
                        pack="material-community"
                        style={[
                            styles.iconStyle,
                            {
                                tintColor: '#F2C94C',
                            },
                        ]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item) return null
        const { description, goalRef } = item
        if (!description || !goalRef) {
            console.warn(
                `${DEBUG_KEY}: no description or goalRef for need feed: `,
                item
            )
        }

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={styles.cardContainerStyle}
                onPress={() => this.handleOnOpen(item)}
                delay={600}
            >
                {this.renderProfileImage(item)}
                {this.renderNeed(item)}
                {this.renderActionIcons(item)}
            </DelayedButton>
        )
    }
}

const styles = {
    cardContainerStyle: {
        flexDirection: 'row',
        padding: 12,
        paddingTop: 10,
        paddingBottom: 10,
        alignItems: 'center',
        marginBottom: 1,
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    iconContainerStyle: {
        height: 36,
        width: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    iconStyle: {
        height: 18,
        width: 18,
        borderRadius: 9,
    },
}

export default connect(null, {
    openGoalDetail,
    openGoalDetailById,
})(NotificationCard)
