/** @format */

import React from 'react'
import { Image, View, Text } from 'react-native'

// utils
import { default_style, color } from '../../../styles/basic'

// components
import DelayedButton from '../Button/DelayedButton'
import ActionButtonGroup from '../../Goal/Common/ActionButtonGroup'
import ActionButton from '../../Goal/Common/ActionButton'

// assets
import CommentIcon from '../../../asset/utils/comment.png'
import CommentSolidIcon from '../../../asset/utils/comment_solid.png'
import ShareIcon from '../../../asset/utils/forward.png'
import ShareSolidIcon from '../../../asset/utils/forward_solid.png'
import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
import LoveIcon from '../../../asset/utils/love.png'
import BottomButtonsSheet from '../Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../../styles'

/**
 * Renders the action bar for a content card
 * On the top you will have Like/Share/Comment count summaries
 * On the bottom you will have the Like/Share/Comment action buttons
 *
 * Style props
 * @prop containerStyle
 * @prop actionSummaryContainerStyle
 * @prop actionItemSummaryWrapperStyle
 * @prop summaryIconStyle
 * @prop summaryTextStyle
 *
 * Value props
 * @prop isShareContent - if true, share button is hidden
 * @prop actionSummaries:{likeCount, shareCount, commentCount} - if all 0, the top summary bar is hidden
 * @prop isContentLiked - if true, the like button is highlighted red
 *
 * Event handler props
 * @prop onContainerLayout
 * @prop onLikeButtonPress
 * @prop onLikeSummaryPress
 * @prop onLikeButtonLayout
 * @prop onShareButtonPress
 * @prop onShareSummaryPress
 * @prop onCommentButtonPress
 * @prop onCommentSummaryPress
 */
class ActionBar extends React.Component {
    render() {
        // Extract style overrides from props and fallback to empty objects
        let {
            containerStyle,
            actionSummaryContainerStyle,
            actionItemSummaryWrapperStyle,
            summaryIconStyle,
            summaryTextStyle,
        } = this.props

        containerStyle = containerStyle || {}
        actionSummaryContainerStyle = actionSummaryContainerStyle || {}
        actionItemSummaryWrapperStyle = actionItemSummaryWrapperStyle || {}
        summaryIconStyle = summaryIconStyle || {}
        summaryTextStyle = summaryTextStyle || {}

        // Extract immutable values and handlers
        const {
            // Overall
            onContainerLayout,
            isShareContent,
            actionSummaries,
            // Like button
            isContentLiked,
            onLikeButtonPress,
            onLikeSummaryPress,
            onLikeButtonLayout,
            // Share button
            onShareButtonPress,
            onShareButtonOptions,
            onShareSummaryPress,
            // Comment button
            onCommentButtonPress,
            onCommentSummaryPress,
        } = this.props

        const { likeCount, shareCount, commentCount } = actionSummaries || {}

        return (
            <View>
                {!onShareButtonPress && Array.isArray(onShareButtonOptions) && (
                    <BottomButtonsSheet
                        ref={(r) => (this.shareGoalBottomSheet = r)}
                        buttons={onShareButtonOptions}
                        height={getButtonBottomSheetHeight(
                            onShareButtonOptions.length
                        )}
                        closeSheetOnOptionPress
                    />
                )}
                <View
                    style={[styles.containerStyle, containerStyle]}
                    onLayout={onContainerLayout}
                >
                    {renderActionSummaryBar(
                        // Values
                        { likeCount, shareCount, commentCount },
                        // Handlers
                        onLikeSummaryPress,
                        onShareSummaryPress,
                        onCommentSummaryPress,
                        // Styles
                        actionSummaryContainerStyle,
                        actionItemSummaryWrapperStyle,
                        summaryIconStyle,
                        summaryTextStyle
                    )}
                    <ActionButtonGroup>
                        <ActionButton
                            iconSource={
                                isContentLiked ? LoveIcon : LoveOutlineIcon
                            }
                            count={0}
                            unitText="Like"
                            textStyle={{
                                color: isContentLiked
                                    ? color.GM_RED
                                    : color.GM_MID_GREY,
                            }}
                            iconStyle={{
                                tintColor: isContentLiked
                                    ? color.GM_RED
                                    : color.GM_MID_GREY,
                            }}
                            onPress={onLikeButtonPress}
                            onLayout={onLikeButtonLayout}
                        />
                        <ActionButton
                            iconSource={ShareIcon}
                            count={0}
                            unitText="Share"
                            textStyle={{ color: color.GM_MID_GREY }}
                            iconStyle={{ tintColor: color.GM_MID_GREY }}
                            onPress={
                                onShareButtonPress ||
                                (() =>
                                    this.shareGoalBottomSheet &&
                                    this.shareGoalBottomSheet.open())
                            }
                            hidden={isShareContent}
                        />
                        <ActionButton
                            iconSource={CommentIcon}
                            count={0}
                            unitText="Reply"
                            textStyle={{ color: color.GM_MID_GREY }}
                            iconStyle={{ tintColor: color.GM_MID_GREY }}
                            onPress={onCommentButtonPress}
                        />
                    </ActionButtonGroup>
                </View>
            </View>
        )
    }
}

renderOnShareBottomSheet = () => {
    const { item, pageId } = this.props
    const { _id, privacy } = item
    const shareType = 'ShareGoal'

    const options = [
        {
            text: 'Publish to Home Feed',
            onPress: () => {
                this.bottomSheetRef.close()
                this.props.shareGoalToMastermind(_id, pageId)
            },
        },
        {
            text: 'Share to a Tribe',
            onPress: () => {
                this.bottomSheetRef.close()
                if (privacy !== 'public') {
                    return sharingPrivacyAlert(SHAREING_PRIVACY_ALERT_TYPE.goal)
                }
                this.props.chooseShareDest(shareType, _id, 'tribe', item)
            },
        },
    ]
    // Options height + bottom space + bottom sheet handler height
    const sheetHeight = getButtonBottomSheetHeight(options.length)
    return (
        <BottomButtonsSheet
            ref={(r) => (this.shareGoalBottomSheet = r)}
            buttons={options}
            height={sheetHeight}
        />
    )
}

/**
 * Renders the top portion of the action bar which shows the Like/Share/Comment counts
 * If no action activity on this content, the summary bar will not render
 * @param summaries:{likeCount, shareCount, commentCount}
 * @param onLikeSummaryPress
 * @param onShareSummaryPress
 * @param onCommentSummaryPress
 * @param actionSummaryContainerStyle
 * @param actionItemSummaryWrapperStyle
 * @param summaryIconStyle
 * @param summaryTextStyle
 */
const renderActionSummaryBar = (
    // Values
    { likeCount, shareCount, commentCount },
    // Handlers
    onLikeSummaryPress,
    onShareSummaryPress,
    onCommentSummaryPress,
    // Styles
    actionSummaryContainerStyle,
    actionItemSummaryWrapperStyle,
    summaryIconStyle,
    summaryTextStyle
) => {
    // Hide summary bar if no actions have been taken on this content
    if (!(likeCount + shareCount + commentCount)) return null

    return (
        <View
            style={[styles.actionSummaryContainer, actionSummaryContainerStyle]}
        >
            {/* Like */}
            {renderSummaryItem(
                // Values
                likeCount,
                // Handlers
                onLikeSummaryPress,
                // Assets
                LoveIcon,
                // Styles
                color.GM_RED,
                actionItemSummaryWrapperStyle,
                summaryIconStyle,
                summaryTextStyle
            )}
            {/* Share */}
            {renderSummaryItem(
                // Values
                shareCount,
                // Handlers
                onShareSummaryPress,
                // Assets
                ShareSolidIcon,
                // Styles
                color.GM_GREEN,
                actionItemSummaryWrapperStyle,
                summaryIconStyle,
                summaryTextStyle
            )}
            {/* Comment */}
            {renderSummaryItem(
                // Values
                commentCount,
                // Handlers
                onCommentSummaryPress,
                // Assets
                CommentSolidIcon,
                // Styles
                color.GM_YELLOW,
                actionItemSummaryWrapperStyle,
                summaryIconStyle,
                summaryTextStyle
            )}
        </View>
    )
}

/**
 * Renders a small action count button to be displayed in the Like/Share/Comment actions summary bar
 * @param itemCount - if 0, item is hidden
 * @param onItemPress
 * @param itemIcon
 * @param itemIconColor - to override default icon color
 * @param actionItemSummaryWrapperStyle
 * @param summaryIconStyle
 * @param summaryTextStyle
 */
const renderSummaryItem = (
    // Values
    itemCount,
    // Handlers
    onItemPress,
    // Assets
    itemIcon,
    // Styles
    itemIconColor,
    actionItemSummaryWrapperStyle,
    summaryIconStyle,
    summaryTextStyle
) => (
    <DelayedButton
        touchableWithoutFeedback
        hidden={!itemCount}
        onPress={onItemPress}
    >
        <View
            style={[
                styles.actionItemSummaryWrapper,
                actionItemSummaryWrapperStyle,
            ]}
        >
            <Image
                source={itemIcon}
                style={[
                    styles.summaryIcon,
                    itemIconColor
                        ? {
                              tintColor: itemIconColor,
                          }
                        : {},
                    summaryIconStyle,
                ]}
            />
            <Text style={[styles.summaryText, summaryTextStyle]}>
                {itemCount}
            </Text>
        </View>
    </DelayedButton>
)

const styles = {
    containerStyle: {
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 0.5,
        borderTopColor: '#f1f1f1',
        borderTopWidth: 0.5,
    },
    actionSummaryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: '#f1f1f1',
        borderBottomWidth: 0.5,
        paddingVertical: 6,
        paddingHorizontal: 8,
    },
    actionItemSummaryWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    summaryIcon: {
        height: 12,
        width: 12,
        marginRight: 8,
    },
    summaryText: {
        ...default_style.buttonText_2,
        color: color.GM_MID_GREY,
    },
}

export default ActionBar
