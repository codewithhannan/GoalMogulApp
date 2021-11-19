/** @format */

import React from 'react'
import { View, Image, Text } from 'react-native'
import timeago from 'timeago.js'
import _ from 'lodash'
import { Icon } from '@ui-kitten/components'

/* Components */
import Name from '../../Common/Name'
import Timestamp from '../../Common/Timestamp'
import { MenuFactory } from '../../../Common/MenuFactory'
import { UserBanner } from '../../../../actions'

// Constants
import {
    CARET_OPTION_NOTIFICATION_SUBSCRIBE,
    CARET_OPTION_NOTIFICATION_UNSUBSCRIBE,
    PRIVACY_OPTIONS,
} from '../../../../Utils/Constants'
import DelayedButton from '../../../Common/Button/DelayedButton'
import { default_style, color } from '../../../../styles/basic'
import { GOALS_STYLE } from '../../../../styles/Goal'

const DEBUG_KEY = '[ UI CommentHeadline ]'
/**
 * Props passed in are:
 * @param reportType={reportType}
 * @param isCommentOwner={isCommentOwner}
 * @param item={item}
 * @param goalRef
 * @param caretOnPress
 */
const CommentHeadline = (props) => {
    // TODO: format time
    const {
        item,
        caretOnPress,
        goalRef,
        isCommentOwner,
        onNamePress,
        onHeadlinePressed,
        hasPrivacy,
    } = props
    const { owner, commentType, suggestion, created, maybeIsSubscribed } = item
    const timeStamp =
        created === undefined || created.length === 0 ? new Date() : created

    // const { privacy } = this.props
    // const privacyObj = PRIVACY_OPTIONS.find(({ value }) => value === privacy)

    const menu = !isCommentOwner
        ? MenuFactory(
              [
                  'Report',
                  maybeIsSubscribed
                      ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
                      : CARET_OPTION_NOTIFICATION_SUBSCRIBE,
              ],
              (val) => caretOnPress(val),
              '',
              {
                  paddingBottom: 8,
                  paddingRight: 8,
                  paddingLeft: 10,
                  paddingTop: 1,
              },
              () => console.log('Report Modal is opened')
          )
        : MenuFactory(
              ['Delete'],
              (val) => caretOnPress(val),
              '',
              // { paddingBottom: 10, paddingLeft: 5, paddingRight: 5, paddingTop: 5 },
              {
                  paddingBottom: 8,
                  paddingRight: 8,
                  paddingLeft: 10,
                  paddingTop: 1,
              },
              () => console.log('Report Modal is opened')
          )

    switch (commentType) {
        case 'Suggestion': {
            if (!suggestion || _.isEmpty(suggestion)) return null
            return (
                <SuggestionHeadlineV2
                    goalRef={goalRef}
                    item={item}
                    timeStamp={timeStamp}
                    menu={menu}
                    onNamePress={onNamePress}
                />
            )
        }

        case 'Comment': {
            return (
                <CommentHeadV2
                    goalRef={goalRef}
                    item={item}
                    timeStamp={timeStamp}
                    menu={menu}
                    onNamePress={onNamePress}
                    onHeadlinePressed={onHeadlinePressed}
                />
            )
        }

        case 'Reply':
        default:
            return (
                <View style={styles.containerStyle}>
                    <Name
                        text={owner.name}
                        onPress={onNamePress}
                        textStyle={default_style.smallTitle_1}
                    />
                    <UserBanner user={owner} />
                    <Timestamp time={timeago().format(timeStamp)} />
                    <View style={styles.caretContainer}>{menu}</View>
                </View>
            )
    }
}

/**
 * Render headline when it's for comment
 * @param {*} props
 */
const CommentHeadV2 = (props) => {
    const {
        goalRef,
        item,
        timeStamp,
        menu,
        onNamePress,
        onHeadlinePressed,
    } = props
    const { owner, needRef, stepRef, mediaRef } = item
    const mediaType = mediaRef ? mediaRef.split('/')[0] : null

    let headerText = { lead: '', description: '' }
    let focusType, focusRef
    if (needRef) {
        headerText = suggestionForNeedStepTextV2(
            goalRef,
            true,
            'Need',
            needRef,
            undefined
        )
        focusType = 'need'
        focusRef = needRef
    }

    if (stepRef) {
        headerText = suggestionForNeedStepTextV2(
            goalRef,
            true,
            'Step',
            stepRef,
            undefined
        )
        focusType = 'step'
        focusRef = stepRef
    }

    const { lead, description } = headerText

    if (needRef || stepRef) {
        return (
            <View>
                <View style={styles.containerStyle}>
                    <Text
                        onPress={onNamePress}
                        style={{
                            ...default_style.smallTitle_1,
                            maxWidth: 150,
                        }}
                        numberOfLines={1}
                    >
                        {owner.name}
                    </Text>
                    <UserBanner user={owner} />
                    <Timestamp time={timeago().format(timeStamp)} />
                    <View style={styles.caretContainer}>{menu}</View>
                </View>

                <View style={styles.containerStyle}>
                    <Text
                        style={{
                            fontSize: 10,
                            flexWrap: 'wrap',
                            alignSelf: 'center',
                            color: '#767676',
                            marginBottom: 2,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {lead}
                    </Text>
                    <DelayedButton
                        activeOpacity={0.6}
                        onPress={() => onHeadlinePressed(focusType, focusRef)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            display: 'flex',
                            flex: 1,
                        }}
                    >
                        <Text
                            style={styles.suggestionDetailTextStyle}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {description}
                        </Text>
                    </DelayedButton>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.containerStyle}>
            <Name
                text={owner.name}
                textStyle={{ fontSize: 12 }}
                onPress={onNamePress}
            />
            <UserBanner user={owner} />
            <Timestamp time={timeago().format(timeStamp)} />
            {mediaType == 'CommentVideo' || mediaType == 'CommentAudio' ? (
                <View
                    style={[
                        GOALS_STYLE.commonPillContainer,
                        {
                            paddingHorizontal: 10,
                            alignSelf: 'center',
                            borderColor: color.GM_MID_GREY,
                            // marginLeft: 70,
                            position: 'absolute',
                            right: 30,
                        },
                    ]}
                >
                    <Icon
                        pack="material-community"
                        name={PRIVACY_OPTIONS[2].materialCommunityIconName}
                        style={[GOALS_STYLE.commonPillIcon]}
                    />
                    <Text style={[GOALS_STYLE.commonPillText]}>
                        {/* {privacyObj.text} */}
                        {PRIVACY_OPTIONS[2].text}
                    </Text>
                </View>
            ) : null}
            <View style={styles.caretContainer}>{menu}</View>
        </View>
    )
}

/**
 * This is new version of suggestion headline and is still in progress. Once done, it should replace
 * SuggestionHeadline.
 *
 * If
 * @param {} props
 */
const SuggestionHeadlineV2 = (props) => {
    const { goalRef, item, timeStamp, menu, onNamePress } = props
    const { owner, suggestion } = item
    if (!goalRef) return null

    const { suggestionFor, suggestionForRef, suggestionType } = suggestion

    // NOTE: starting version 0.3.10, we only say Suggested for Goal. Thus we pass in undefined for suggestionType
    // const text = suggestionFor === 'Goal'
    //   ? suggestionForGoalTextV2(goalRef, suggestionType)
    //   : suggestionForNeedStepTextV2(goalRef, false, suggestionFor, suggestionForRef, suggestionType);
    const text =
        suggestionFor === 'Goal'
            ? suggestionForGoalTextV2(goalRef, undefined)
            : suggestionForNeedStepTextV2(
                  goalRef,
                  false,
                  suggestionFor,
                  suggestionForRef,
                  undefined
              )

    const { lead, description } = text

    return (
        <View>
            <View style={styles.containerStyle}>
                <Name
                    text={owner.name}
                    textStyle={default_style.smallTitle_1}
                    onPress={onNamePress}
                />
                <UserBanner user={owner} />
                <Timestamp time={timeago().format(timeStamp)} />
                <View style={styles.caretContainer}>{menu}</View>
            </View>
            {/* <View style={styles.containerStyle}>
                <Text
                    style={styles.suggestionTextStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {lead}
                    <Text style={styles.suggestionDetailTextStyle}>
                        {description}
                    </Text>
                </Text>
            </View> */}
        </View>
    )
}

const makeSuggestionTypeText = (suggestionType) => {
    if (suggestionType === 'User') {
        return 'an User '
    }
    if (suggestionType === 'Event') {
        return 'an Event '
    }
    if (suggestionType === 'Tribe') {
        return 'a Tribe '
    }
    if (suggestionType === 'ChatConvoRoom') {
        return 'a Chat room '
    }
    return ''
}

/**
 * Construct suggestion comment card headline text for a goal
 * e.g Suggested an Event for Goal: ${goalTitle}
 *
 * @param {*} goalRef
 * @param {*} suggestionType
 */
const suggestionForGoalTextV2 = (goalRef, suggestionType) => {
    const suggestionTypeText = makeSuggestionTypeText(suggestionType)
    return {
        lead: `Suggested ${suggestionTypeText}for Goal: `,
        description: goalRef.title,
    }
}

/**
 * Construct suggestion comment card headline text for a need/step
 * e.g Suggested an Event for Need: ${needText}
 *
 * NOTE: if suggestionType is undefined, there is no 'an Event' or 'an User'
 *
 * @param {*} goalRef
 * @param {boolean} isComment
 * @param {string} suggestionFor ['Need', 'Step']
 * @param {*} suggestionForRef
 * @param {string} suggestionType [User, Event, Tribe, ChatConvoRoom] This can be undefined for comment
 */
const suggestionForNeedStepTextV2 = (
    goalRef,
    isComment,
    suggestionFor,
    suggestionForRef,
    suggestionType
) => {
    let ret = {
        lead: '', // ['Commented for Need: ', 'Commented for Step 1: ', 'Suggested for Step 1: ', 'Suggestion for Need: ']
        description: '',
    }
    const dataToGet = suggestionFor === 'Step' ? goalRef.steps : goalRef.needs

    if (!dataToGet || _.isEmpty(dataToGet)) return ret
    dataToGet.forEach((item) => {
        if (item._id === suggestionForRef) {
            const order = suggestionFor === 'Need' ? '' : ` ${item.order}`
            const suggestionTypeText = makeSuggestionTypeText(suggestionType)
            const leadText = isComment
                ? 'Commented for'
                : `Suggested ${suggestionTypeText}for`
            ret = {
                lead: `${leadText} ${suggestionFor}${order}: `,
                description: item.description,
            }
        }
    })
    return ret
}

const styles = {
    containerStyle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    caretContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    imageStyle: {
        alignSelf: 'center',
        marginLeft: 3,
        marginRight: 3,
    },
    suggestionTextStyle: {
        ...default_style.smallText_1,
        flex: 1,
        flexWrap: 'wrap',
        alignSelf: 'center',
        paddingRight: 15,
        marginBottom: 2,
    },
    // For suggestion text stlye V2
    suggestionTextStyleV2: {
        fontSize: 10,
        flex: 1,
        flexWrap: 'wrap',
        alignSelf: 'center',
        color: '#767676',
        paddingRight: 15,
        marginBottom: 2,
        textAlignVertical: 'center',
    },
    imageStyleV2: {
        marginLeft: 2,
        marginRight: 2,
        height: 15,
        width: 13,
    },
    suggestionDetailTextStyle: {
        ...default_style.smallTitle_1,
        color: '#6bc6f0',
        flexWrap: 'wrap',
        paddingRight: 15,
        marginBottom: 2,
    },
}

export default CommentHeadline
