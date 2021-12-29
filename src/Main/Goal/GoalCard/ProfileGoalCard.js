/**
 * This component corresponds to My Goals2.2-1 design. New user page
 * condensed goal layout
 *
 * @format
 */

import React from 'react'
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import timeago from 'timeago.js'
import _ from 'lodash'
import Tooltip from 'react-native-walkthrough-tooltip'

import SwiperTooltip from '../../../Main/Common/Tooltip'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

// Components
import Timestamp from '../Common/Timestamp'
import GoalCardBody from '../Common/GoalCardBody'
import DelayedButton from '../../Common/Button/DelayedButton'

// Assets
import LoveIcon from '../../../asset/utils/love.png'
import LoveOutlineIcon from '../../../asset/utils/love-outline.png'
import CommentIcon from '../../../asset/utils/comment.png'
import ShareIcon from '../../../asset/utils/forward.png'
// import RECORDING from '../../../asset/utils/Recording.png'
// import VIDEO from '../../../asset/utils/Video.png'
// import ACCOUNTABILITY from '../../../asset/utils/Accountability.png'
// import SWIPER_BACKGROUND from '../../../asset/image/tooltip2.png'

// Selector

// import { getUserData } from '../../../redux/modules/User/Selector'

// import Swipeable from 'react-native-gesture-handler/Swipeable'
// import * as Animatable from 'react-native-animatable'

// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions'
import { default_style, color, text } from '../../../styles/basic'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'
import { PRIVACY_OPTIONS } from '../../../Utils/Constants'
import { PRIORTY_PILL_STYLES, GOALS_STYLE } from '../../../styles/Goal'
import { Icon } from '@ui-kitten/components'
import { submitGoalPrivacy } from '../../../redux/modules/goal/CreateGoalActions'
import { openCameraForVideo, openCameraRollForVideo } from '../../../actions'
// import { getButtonBottomSheetHeight } from '../../../styles'
// import BottomButtonsSheet from '../../Common/Modal/BottomButtonsSheet'
// import CommentVideoModal from '../../Common/Modal/CommentVideoModal'
// import AccountabilityPopUp from '../../Common/Modal/AccountabilityPopUp'
// import { getFirstName } from '../../../Utils/HelperMethods'
import GoalSwiper from '../GoalSwiper'

let privacyName = ''
let row = []
let prevOpenedRow
// file:///var/mobile/Containers/Data/Application/DB0E429C-1C64-4902-A008-74081503A97A/Library/Caches/ExponentExperienceData/%2540abdulhannan96%252Fgoalmogul/ImagePicker/113BBD27-8D9F-4444-B929-12053F3ED6C7.mov

const swiperText = 'You can leave a video or voice comment! 😃'

const privacyOptions = [
    {
        text: 'Friends',
        title: 'Friends',
        iconName: 'account-multiple',
        value: 'friends',
    },
    {
        text: 'Close Friends',
        title: 'Close Friends',
        iconName: 'heart',
        value: 'close-friends',
    },
    {
        text: 'Public',
        title: 'Public',
        iconName: 'earth',
        value: 'public',
    },
    {
        text: 'Only Me',
        title: 'Private',
        iconName: 'lock',
        value: 'self',
    },
]

class ProfileGoalCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            toolTipVisible: false,
            swiperToolTipVisible: false,
            videoModalVisible: false,
            accountPopUpVisible: false,
        }
        this.refsArray = [] // add this
        // this.SWIPED_DATA = [
        //     {
        //         id: 1,
        //         source: ACCOUNTABILITY,
        //         onPress: () => {
        //             prevOpenedRow.close()
        //             this.setState({ accountPopUpVisible: true })
        //         },
        //         backgroundColor: '#CEFFBC',
        //     },

        //     {
        //         id: 3,
        //         source: RECORDING,
        //         onPress: () => {
        //             prevOpenedRow.close()
        //             this.openRecordingModal()
        //         },
        //         backgroundColor: '#D7F3FF',
        //     },
        //     {
        //         id: 2,
        //         source: VIDEO,
        //         onPress: () => this.openCameraRollBottomSheet(),
        //         backgroundColor: '#E5F7FF',
        //     },
        // ]
    }

    // showVideoModal = () => this.setState({ videoModalVisible: true })
    // openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    // closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    // openRecordingModal = () => this.bottomRecodingSheet.open()
    // closeRecordingnModal = () => this.bottomRecodingSheet.close()

    // onVideoPress = () => {
    //     const showModal = () => {
    //         this.showVideoModal()
    //     }
    //     return this.props.openCameraForVideo(showModal)
    // }

    // onVideoSelect = () => {
    //     const showModal = () => {
    //         this.showVideoModal()
    //     }
    //     return this.props.openCameraRollForVideo(showModal)
    // }

    // makeCameraRefOptions = () => {
    //     return [
    //         {
    //             text: 'Record a Video',
    //             onPress: () => {
    //                 prevOpenedRow.close()
    //                 this.closeNotificationBottomSheet(),
    //                     setTimeout(() => {
    //                         this.onVideoPress()
    //                     }, 500)
    //             },
    //         },
    //         {
    //             text: 'Open Camera Roll',
    //             onPress: () => {
    //                 prevOpenedRow.close()
    //                 this.closeNotificationBottomSheet()
    //                 setTimeout(() => {
    //                     this.onVideoSelect()
    //                 }, 500)
    //             },
    //         },
    //     ]
    // }

    // renderBottomVoiceRecording = () => {
    //     const sheetHeight = getButtonBottomSheetHeight(5)
    //     return (
    //         <BottomButtonsSheet
    //             ref={(r) => (this.bottomRecodingSheet = r)}
    //             buttons={[{}]}
    //             height={sheetHeight}
    //             chatRecordingPress
    //         />
    //     )
    // }

    // renderCameraRollBottomSheet = () => {
    //     const options = this.makeCameraRefOptions()

    //     const sheetHeight = getButtonBottomSheetHeight(options.length)

    //     return (
    //         <BottomButtonsSheet
    //             ref={(r) => (this.CameraRefBottomSheetRef = r)}
    //             buttons={options}
    //             height={sheetHeight}
    //         />
    //     )
    // }

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

        // console.log('this is itemsssssss', item)

        const { _id: goalId } = item
        const { _id: ownerId } = item
        const { token } = this.props

        privacyName = privacyObj.text

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

                        {this.props.self ? (
                            <Tooltip
                                animated={true}
                                arrowSize={{ width: 16, height: 8 }}
                                backgroundColor="rgba(0,0,0,0.5)"
                                isVisible={this.state.toolTipVisible}
                                contentStyle={{
                                    backgroundColor: '#EFEFEF',
                                    // width: wp('95%'),
                                }}
                                //
                                content={
                                    <>
                                        <View style={{ margin: 7 }}>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: '600',
                                                    color: '#535353',
                                                }}
                                            >
                                                Privacy:
                                            </Text>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {privacyOptions.map(
                                                (options, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            key={options}
                                                            onPress={() => {
                                                                this.props.submitGoalPrivacy(
                                                                    goalId,
                                                                    options.value,
                                                                    token
                                                                )
                                                                this.setState({
                                                                    toolTipVisible: false,
                                                                })
                                                            }}
                                                        >
                                                            <View
                                                                style={[
                                                                    GOALS_STYLE.commonPillContainer,
                                                                    {
                                                                        height: 35,
                                                                        borderColor:
                                                                            '#828282',
                                                                        borderWidth:
                                                                            options.text ==
                                                                            privacyName
                                                                                ? 1
                                                                                : 0.3,

                                                                        marginHorizontal: 3,
                                                                        marginBottom: 5,
                                                                        backgroundColor:
                                                                            options.text ==
                                                                            privacyName
                                                                                ? '#EFEFEF'
                                                                                : 'white',
                                                                    },
                                                                ]}
                                                            >
                                                                <Icon
                                                                    pack="material-community"
                                                                    name={
                                                                        options.iconName
                                                                    }
                                                                    style={{
                                                                        height: 12,
                                                                        width: 12,
                                                                        tintColor:
                                                                            '#828282',
                                                                    }}
                                                                />

                                                                <Text
                                                                    style={{
                                                                        fontFamily:
                                                                            text
                                                                                .FONT_FAMILY
                                                                                .SEMI_BOLD,
                                                                        fontSize: 11,
                                                                        color:
                                                                            '#828282',
                                                                        marginLeft: 5,
                                                                    }}
                                                                >
                                                                    {
                                                                        options.title
                                                                    }
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                            )}
                                        </View>
                                    </>
                                }
                                placement="bottom"
                                onClose={() =>
                                    this.setState({ toolTipVisible: false })
                                }
                            >
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({ toolTipVisible: true })
                                    }
                                >
                                    <Text style={[GOALS_STYLE.commonPillText]}>
                                        {privacyObj.text}
                                    </Text>
                                </TouchableOpacity>
                            </Tooltip>
                        ) : (
                            <Text style={[GOALS_STYLE.commonPillText]}>
                                {privacyObj.text}
                            </Text>
                        )}
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
            <>
                <GoalCardBody
                    startTime={start}
                    endTime={end}
                    steps={steps}
                    needs={needs}
                    goalRef={item}
                    pageId={this.props.pageId}
                />
            </>
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

    // rightSwipeActions = () => {
    //     return (
    //         <>
    //             {this.state.swiperToolTipVisible && this.props.index == 0 ? (
    //                 <SwiperTooltip
    //                     title={swiperText}
    //                     imageSource={SWIPER_BACKGROUND}
    //                     type="swiperDetail"
    //                     bgStyle={{ width: 200, height: 87 }}
    //                     viewStyle={{
    //                         position: 'absolute',
    //                         zIndex: 1,
    //                         left: 95,
    //                         top: 0,
    //                     }}
    //                 />
    //             ) : null}

    //             {this.SWIPED_DATA.map((item, index) => {
    //                 return (
    //                     <TouchableOpacity
    //                         onPress={item.onPress}
    //                         key={index}
    //                         activeOpacity={0.7}
    //                         style={{
    //                             backgroundColor: item.backgroundColor,
    //                             justifyContent: 'center',
    //                             alignItems: 'center',
    //                             width: 100,
    //                             height: '97%',
    //                         }}
    //                     >
    //                         <Animatable.View>
    //                             <Image
    //                                 source={item.source}
    //                                 resizeMode="contain"
    //                                 style={{ height: 40, width: 40 }}
    //                             />
    //                         </Animatable.View>
    //                     </TouchableOpacity>
    //                 )
    //             })}
    //         </>
    //     )
    // }

    // closeRow = (index) => {
    //     if (prevOpenedRow && prevOpenedRow !== row[index]) {
    //         prevOpenedRow.close()
    //     }
    //     prevOpenedRow = row[index]
    // }

    render() {
        const { item, index, visitedUserName } = this.props

        const goalRef = { goalRef: item }

        if (!item || _.isEmpty(item)) return null

        const backgroundColor = item.isCompleted
            ? '#F6F6F6'
            : color.GM_CARD_BACKGROUND
        return (
            <>
                {!this.props.isSelf && this.props.friendShip ? (
                    <>
                        {/* <CommentVideoModal
                            isVisible={this.state.videoModalVisible}
                            onClose={() =>
                                this.setState({ videoModalVisible: false })
                            }
                            onRecordPress={this.openCameraRollBottomSheet}
                        /> */}
                        {/* <Swipeable
                            renderRightActions={this.rightSwipeActions}
                            friction={2}
                            ref={(ref) => (row[index] = ref)}
                            leftThreshold={80}
                            rightThreshold={40}
                            onSwipeableRightOpen={() =>
                                this.setState({ swiperToolTipVisible: true })
                            }
                            onSwipeableOpen={this.closeRow(index)}
                        > */}
                        <GoalSwiper
                            index={index}
                            marginBottom={8}
                            goalRef={goalRef}
                        >
                            <DelayedButton
                                index={index}
                                activeOpacity={1}
                                style={[
                                    styles.cardContainerStyle,
                                    { backgroundColor },
                                ]}
                                onPress={() => this.handleOnCardPress(item)}
                            >
                                {this.renderHeader(item)}
                                {this.renderTitle(item)}
                                {this.renderProgressBar(item)}
                                {this.renderStats(item)}
                            </DelayedButton>
                        </GoalSwiper>
                        {/* </Swipeable> */}
                        {/* {this.renderCameraRollBottomSheet()}
                        {this.renderBottomVoiceRecording()} */}
                        {/* <AccountabilityPopUp
                            isVisible={this.state.accountPopUpVisible}
                            onClose={() =>
                                this.setState({ accountPopUpVisible: false })
                            }
                            name={getFirstName(visitedUserName)}
                        /> */}
                    </>
                ) : (
                    <DelayedButton
                        index={index}
                        activeOpacity={1}
                        style={[styles.cardContainerStyle, { backgroundColor }]}
                        onPress={() => this.handleOnCardPress(item)}
                    >
                        {this.renderHeader(item)}
                        {this.renderTitle(item)}
                        {this.renderProgressBar(item)}
                        {this.renderStats(item)}
                    </DelayedButton>
                )}
            </>
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

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user
    const { userId } = props
    const self = userId === state.user.userId

    const visitedUserName = state.profile.user.name

    return {
        token,
        self,
        visitedUserName,
    }
}

export default connect(mapStateToProps, {
    openGoalDetail,
    submitGoalPrivacy,
    openCameraForVideo,
    openCameraRollForVideo,
})(wrapAnalytics(ProfileGoalCard, SCREENS.PROFILE_GOAL_TAB))
