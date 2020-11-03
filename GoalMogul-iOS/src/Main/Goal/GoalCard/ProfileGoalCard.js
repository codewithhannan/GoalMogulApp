/**
 * This component corresponds to My Goals2.2-1 design. New user page
 * condensed goal layout
 *
 * @format
 */

import React from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import _ from 'lodash'

// Components
import Timestamp from '../Common/Timestamp'
import GoalCardBody from '../Common/GoalCardBody'
import DelayedButton from '../../Common/Button/DelayedButton'

// Assets
import LoveIcon from '../../../asset/utils/love.png'
import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
import CommentIcon from '../../../asset/utils/comment.png'
import ShareIcon from '../../../asset/utils/forward.png'

// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { default_style, color } from '../../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import { PRIORTY_PILL_STYLES, GOALS_STYLE } from '../../../styles/Goal'
import { Icon } from '@ui-kitten/components'

class ProfileGoalCard extends React.Component {
    /* Handler functions for actions */

    /**
     * Open Goal Detail page on Card pressed
     */
    handleOnCardPress = (item) => {
        this.props.onPress
            ? this.props.onPress()
            : this.props.openGoalDetail(item)
    }

    /* Renderers for views */

    /**
     * This method renders category and timestamp
     */
    renderHeader(item) {
        const { category, created, privacy, isCompleted, priority } = item
        const privacyObj = PRIVACY_OPTIONS.find(
            ({ value }) => value === privacy
        )

        const PRIORTY_PILL_STYLE =
            PRIORTY_PILL_STYLES[((priority || 1) - 1) % 10]

        return (
            <View style={styles.headerContainerStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={default_style.smallTitle_1}>{category}</Text>
                    <Text style={default_style.smallText_1}> | </Text>
                    <Timestamp time={timeago().format(created)} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Privacy pill */}
                    <View
                        style={[
                            GOALS_STYLE.commonPillContainer,
                            {
                                width: GOALS_STYLE.privacyPillWidth,
                                borderWidth: isCompleted ? 0.25 : 0,
                                borderColor: color.GM_MID_GREY,
                            },
                        ]}
                    >
                        <Icon
                            pack="material-community"
                            name={privacyObj.materialCommunityIconName}
                            style={[GOALS_STYLE.commonPillIcon]}
                        />
                        <Text style={[GOALS_STYLE.commonPillText]}>
                            {privacyObj.text}
                        </Text>
                    </View>
                    {/* Priority pill */}
                    <View
                        style={[
                            GOALS_STYLE.commonPillContainer,
                            {
                                width: GOALS_STYLE.priorityPillWidth,
                                backgroundColor:
                                    PRIORTY_PILL_STYLE.backgroundColor,
                                borderColor: PRIORTY_PILL_STYLE.color,
                                borderWidth: isCompleted ? 0.25 : 0,
                                marginLeft: 8,
                            },
                        ]}
                    >
                        <Icon
                            pack="material-community"
                            name={PRIORTY_PILL_STYLE.materialCommunityIconName}
                            style={[
                                GOALS_STYLE.commonPillIcon,
                                { tintColor: PRIORTY_PILL_STYLE.color },
                            ]}
                        />
                        <Text
                            style={[
                                GOALS_STYLE.commonPillText,
                                { color: PRIORTY_PILL_STYLE.color },
                            ]}
                        >
                            {priority}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * This method renders goal title
     */
    renderTitle(item) {
        const { title } = item
        return (
            <Text
                style={{
                    ...default_style.goalTitleText_1,
                    flex: 1,
                    flexWrap: 'wrap',
                    marginVertical: 6,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {title}
            </Text>
        )
    }

    renderProgressBar(item) {
        const { start, end, steps, needs } = item
        return (
            <GoalCardBody
                startTime={start}
                endTime={end}
                steps={steps}
                needs={needs}
                goalRef={item}
                pageId={this.props.pageId}
            />
        )
    }

    /**
     * THis method renders stats including like, forward and suggestion count
     */
    renderStats(item) {
        const { maybeLikeRef } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0

        return (
            <View style={styles.statsContainerStyle}>
                <View style={{ flexDirection: 'row' }}>
                    <StatsComponent
                        iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
                        iconStyle={{
                            tintColor: selfLiked ? '#EB5757' : '#828282',
                        }}
                        textStyle={{ color: '#828282' }}
                        text={likeCount > 0 ? likeCount : null}
                    />
                    <StatsComponent
                        iconSource={ShareIcon}
                        iconStyle={{ tintColor: '#828282' }}
                        textStyle={{ color: '#828282' }}
                        text={shareCount}
                        containerStyle={{
                            marginLeft: 18 * default_style.uiScale,
                        }}
                    />
                </View>
                <StatsComponent
                    iconSource={CommentIcon}
                    iconStyle={{ tintColor: '#828282' }}
                    textStyle={{ color: '#828282' }}
                    text={
                        commentCount +
                        ' Comment' +
                        (commentCount !== 1 ? 's' : '')
                    }
                />
            </View>
        )
    }

    render() {
        const { item } = this.props
        if (!item || _.isEmpty(item)) return null

        const backgroundColor = item.isCompleted
            ? '#F6F6F6'
            : color.GM_CARD_BACKGROUND
        return (
            <DelayedButton
                activeOpacity={1}
                style={[styles.cardContainerStyle, { backgroundColor }]}
                onPress={() => this.handleOnCardPress(item)}
            >
                {this.renderHeader(item)}
                {this.renderTitle(item)}
                {this.renderProgressBar(item)}
                {this.renderStats(item)}
            </DelayedButton>
        )
    }
}

const StatsComponent = (props) => {
    const { iconStyle, textStyle, iconSource, text, containerStyle } = props
    return (
        <View
            style={{
                marginTop: 3,
                marginBottom: 3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                ...containerStyle,
            }}
        >
            <Image
                resizeMode="contain"
                source={iconSource}
                style={{ ...default_style.smallIcon_1, ...iconStyle }}
            />
            <Text
                style={{
                    ...default_style.smallTitle_1,
                    marginLeft: 7,
                    ...textStyle,
                }}
            >
                {text}
            </Text>
        </View>
    )
}

const styles = {
    cardContainerStyle: {
        marginBottom: 8,
        padding: 16,
        borderRadius: 2,
    },
    headerContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 8,
    },
    // Stats component default style
    statsContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
}

export default connect(null, {
    openGoalDetail,
})(wrapAnalytics(ProfileGoalCard, SCREENS.PROFILE_GOAL_TAB))
