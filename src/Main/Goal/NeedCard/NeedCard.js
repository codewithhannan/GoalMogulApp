/** @format */

import _ from 'lodash'
import R from 'ramda'
import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import { deleteGoal } from '../../../actions'
import BulbIcon from '../../../asset/utils/bulb.png'
import ShareIcon from '../../../asset/utils/forward.png'
import LoveIcon from '../../../asset/utils/love.png'
import {
    PAGE_TYPE_MAP,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
// Actions
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions'
import {
    subscribeEntityNotification,
    unsubscribeEntityNotification,
} from '../../../redux/modules/notification/NotificationActions'
import { createReport } from '../../../redux/modules/report/ReportActions'
// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
} from '../../../Utils/Constants'
import { RightArrowIcon } from '../../../Utils/Icons'
import ProfileImage from '../../Common/ProfileImage'
import ActionButton from '../Common/ActionButton'
import ActionButtonGroup from '../Common/ActionButtonGroup'
// Component
import Headline from '../Common/Headline'
import NextButton from '../Common/NextButton'
import SectionCard from '../Common/SectionCard'
import Timestamp from '../Common/Timestamp'

const DEBUG_KEY = '[ UI NeedCard ]'

class NeedCard extends Component {
    // card central content
    renderCardContent(item) {
        const { description } = item
        return (
            <View style={{ marginTop: 20 }}>
                <Text style={{ color: '#505050' }}>{description}</Text>
            </View>
        )
    }

    // user basic information
    renderUserDetail(item) {
        const {
            created,
            needRequest,
            category,
            owner,
            _id,
            maybeIsSubscribed,
        } = item
        const { description } = needRequest
        const timeStamp =
            created === undefined || created.length === 0 ? new Date() : created

        const pageId = _.get(PAGE_TYPE_MAP, 'goalFeed')

        const caret = {
            self: {
                options: [{ option: 'Delete' }],
                onPress: () => {
                    this.props.deleteGoal(_id, pageId)
                },
                shouldExtendOptionLength: false,
            },
            others: {
                options: [
                    { option: 'Report' },
                    {
                        option: maybeIsSubscribed
                            ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                            : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
                    },
                ],
                onPress: (key) => {
                    if (key === 'Report') {
                        return this.props.createReport(_id, 'goal', 'Goal')
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(
                            _id,
                            'Goal'
                        )
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(
                            _id,
                            'Goal'
                        )
                    }
                },
                shouldExtendOptionLength: false,
            },
        }

        return (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <ProfileImage
                    imageStyle={{ height: 60, width: 60 }}
                    imageUrl={getProfileImageOrDefaultFromUser(owner)}
                />
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Headline
                        name={owner.name}
                        category={category}
                        caret={caret}
                        user={owner}
                        isSelf={owner._id === this.props.userId}
                    />
                    <Timestamp time={timeago().format(timeStamp)} />
                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Text
                            style={{
                                flex: 1,
                                flexWrap: 'wrap',
                                color: '#818181',
                                fontSize: 11,
                            }}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    /**
     * Might need to change in the future since it should render the need that
     * user shared. Currently it's rendering all the needs.
     */
    renderNeed(item) {
        const { needs } = item
        return needs.map((need, index) => {
            return (
                <SectionCard
                    goalRef={item}
                    key={Math.random().toString(36).substr(2, 9)}
                    item={need}
                    onPress={() => this.props.openGoalDetail(item)}
                    type="need"
                />
            )
        })
    }

    renderViewGoal(item) {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 10,
                }}
                onPress={() => this.props.onPress(item)}
            >
                <Text style={styles.viewGoalTextStyle}>View Goal</Text>
                <RightArrowIcon
                    iconStyle={{
                        tintColor: '#17B3EC',
                        ...styles.iconStyle,
                        height: 12,
                        width: 18,
                    }}
                    iconContainerStyle={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginLeft: 5,
                    }}
                />
                {/* <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#17B3EC'
            iconStyle={styles.iconStyle}
          />
        </View> */}
            </TouchableOpacity>
        )
    }

    renderActionButtons() {
        const { item } = this.props
        const { maybeLikeRef, _id } = item

        const likeCount = item.likeCount ? item.likeCount : 0
        const commentCount = item.commentCount ? item.commentCount : 0
        const shareCount = item.shareCount ? item.shareCount : 0

        const likeButtonContainerStyle =
            maybeLikeRef && maybeLikeRef.length > 0
                ? { backgroundColor: '#FAD6C8' }
                : { backgroundColor: 'white' }

        return (
            <ActionButtonGroup>
                <ActionButton
                    iconSource={LoveIcon}
                    count={likeCount}
                    textStyle={{ color: '#f15860' }}
                    iconContainerStyle={likeButtonContainerStyle}
                    iconStyle={{
                        tintColor: '#f15860',
                        borderRadius: 5,
                        height: 20,
                        width: 22,
                        marginTop: 1.5,
                    }}
                    onPress={() => {
                        console.log(`${DEBUG_KEY}: user clicks like icon.`)
                        if (maybeLikeRef && maybeLikeRef.length > 0) {
                            return this.props.unLikeGoal(
                                'post',
                                _id,
                                maybeLikeRef
                            )
                        }
                        this.props.likeGoal('post', _id)
                    }}
                />
                <ActionButton
                    iconSource={BulbIcon}
                    count={commentCount}
                    textStyle={{ color: '#FCB110' }}
                    iconStyle={{ tintColor: '#FCB110', height: 26, width: 26 }}
                    onPress={() => {
                        console.log(
                            `${DEBUG_KEY}: user clicks comment icon on NeedCard`
                        )
                        this.props.onPress(this.props.item, {
                            type: 'comment',
                            _id: undefined,
                            initialShowSuggestionModal: false,
                            initialFocusCommentBox: true,
                        })
                    }}
                />
            </ActionButtonGroup>
        )
    }

    render() {
        const { item } = this.props
        const { owner } = item
        const { name } = owner
        return (
            <View>
                <View
                    style={{
                        backgroundColor: '#f8f8f8',
                        ...styles.borderShadow,
                    }}
                >
                    <View style={{ backgroundColor: '#e5e5e5' }}>
                        <View
                            style={{
                                marginBottom: 0.5,
                                backgroundColor: 'white',
                                padding: 5,
                            }}
                        >
                            <Text style={{ fontSize: 11 }}>
                                <Text style={{ fontWeight: '800' }}>
                                    {name}{' '}
                                </Text>
                                share a need
                            </Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.containerStyle}
                            onPress={() => this.props.onPress(this.props.item)}
                        >
                            <View
                                style={{
                                    marginTop: 20,
                                    marginBottom: 20,
                                    marginRight: 15,
                                    marginLeft: 15,
                                }}
                            >
                                {this.renderUserDetail(item)}
                                {this.renderCardContent(item)}
                            </View>
                        </TouchableOpacity>

                        {this.renderNeed(item)}

                        <View style={{ ...styles.containerStyle }}>
                            {this.renderViewGoal(item)}
                            {this.renderActionButtons()}
                        </View>
                    </View>
                </View>

                <NextButton
                    onPress={() => console.log('press for next item')}
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white',
    },
    viewGoalTextStyle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#17B3EC',
        alignSelf: 'center',
    },
    iconStyle: {
        alignSelf: 'center',
        // fontSize: 20,
        // marginLeft: 5,
        // marginTop: 2
    },
    borderShadow: {
        shadowColor: 'lightgray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
}

const mapStateToProps = (state) => {
    const { userId } = state.user
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    likeGoal,
    createReport,
    unLikeGoal,
    openGoalDetail,
    subscribeEntityNotification,
    unsubscribeEntityNotification,
    deleteGoal,
})(NeedCard)
