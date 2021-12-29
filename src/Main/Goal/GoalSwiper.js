/** @format */

import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import RECORDING from '../../asset/utils/Recording.png'
import VIDEO from '../../asset/utils/Video.png'
import ACCOUNTABILITY from '../../asset/utils/Accountability.png'
import SWIPER_BACKGROUND from '../../asset/image/tooltip2.png'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import * as Animatable from 'react-native-animatable'
import { openCameraForVideo, openCameraRollForVideo } from '../../actions'
import CommentVideoModal from '../Common/Modal/CommentVideoModal'
import AccountabilityPopUp from '../Common/Modal/AccountabilityPopUp'
import BottomButtonsSheet from '../Common/Modal/BottomButtonsSheet'
import { getButtonBottomSheetHeight } from '../../styles'
import { getFirstName } from '../../Utils/HelperMethods'
import { connect } from 'react-redux'
import SwiperTooltip from '../Common/Tooltip'
import { refreshProfileData } from '../../actions'
import { getNewCommentByTab } from '../../redux/modules/feed/comment/CommentSelector'
import { constructPageId } from '../../redux/middleware/utils'

const swiperText = 'You can leave a video or voice comment! 😃'
let row = []
let prevOpenedRow
class GoalSwiper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            swiperToolTipVisible: false,
            videoModalVisible: false,
            accountPopUpVisible: false,
        }
        this.refsArray = [] // add this
        this.SWIPED_DATA = [
            // {
            //     id: 1,
            //     source: ACCOUNTABILITY,
            //     onPress: () => {
            //         prevOpenedRow.close()
            //         this.setState({ accountPopUpVisible: true })
            //     },
            //     backgroundColor: '#CEFFBC',
            // },

            {
                id: 3,
                source: RECORDING,
                onPress: () => {
                    prevOpenedRow.close()
                    this.openRecordingModal()
                },
                backgroundColor: '#D7F3FF',
            },
            // {
            //     id: 2,
            //     source: VIDEO,
            //     onPress: () => this.openCameraRollBottomSheet(),
            //     backgroundColor: '#E5F7FF',
            // },
        ]
    }

    showVideoModal = () =>
        this.setState({ videoModalVisible: true }, () =>
            console.log('MODAL OPENEDE')
        )
    openCameraRollBottomSheet = () => this.CameraRefBottomSheetRef.open()
    closeNotificationBottomSheet = () => this.CameraRefBottomSheetRef.close()
    openRecordingModal = () => this.bottomRecodingSheet.open()
    closeRecordingnModal = () => this.bottomRecodingSheet.close()

    onVideoPress = () => {
        const showModal = () => {
            this.showVideoModal()
        }
        return this.props.openCameraForVideo(showModal)
    }

    onVideoSelect = () => {
        const showModal = () => {
            this.showVideoModal()
        }
        return this.props.openCameraRollForVideo(showModal)
    }

    makeCameraRefOptions = () => {
        return [
            {
                text: 'Record a Video',
                onPress: () => {
                    prevOpenedRow.close()
                    this.closeNotificationBottomSheet(),
                        setTimeout(() => {
                            this.onVideoPress()
                        }, 500)
                },
            },
            {
                text: 'Open Camera Roll',
                onPress: () => {
                    prevOpenedRow.close()
                    this.closeNotificationBottomSheet()
                    setTimeout(() => {
                        this.onVideoSelect()
                    }, 500)
                },
            },
        ]
    }

    renderBottomVoiceRecording = () => {
        const sheetHeight = getButtonBottomSheetHeight(5)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomRecodingSheet = r)}
                buttons={[{}]}
                height={sheetHeight}
                commentRecordingPress
                pageId={this.props.pageId}
                item={this.props.goalRef}
            />
        )
    }

    renderCameraRollBottomSheet = () => {
        const options = this.makeCameraRefOptions()

        const sheetHeight = getButtonBottomSheetHeight(options.length)

        return (
            <BottomButtonsSheet
                ref={(r) => (this.CameraRefBottomSheetRef = r)}
                buttons={options}
                height={sheetHeight}
            />
        )
    }
    rightSwipeActions = () => {
        const { marginTop, marginBottom } = this.props
        return (
            <>
                {/* {this.state.swiperToolTipVisible && this.props.index == 0 ? (
                    <SwiperTooltip
                        title={swiperText}
                        imageSource={SWIPER_BACKGROUND}
                        type="swiperDetail"
                        bgStyle={{ width: 200, height: 87 }}
                        viewStyle={{
                            position: 'absolute',
                            zIndex: 1,
                            left: 95,
                            top: 0,
                        }}
                    />
                ) : null} */}

                {this.SWIPED_DATA.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={item.onPress}
                            key={Math.random().toString(36).substr(2, 9)}
                            activeOpacity={0.7}
                            style={{
                                backgroundColor: item.backgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                marginBottom: marginBottom,
                                padding: 16,
                                marginTop: marginTop,
                                zIndex: 2,
                            }}
                        >
                            <Animatable.View>
                                <Image
                                    source={item.source}
                                    resizeMode="contain"
                                    style={{ height: 40, width: 40 }}
                                />
                            </Animatable.View>
                        </TouchableOpacity>
                    )
                })}
            </>
        )
    }

    closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            prevOpenedRow.close()
        }
        prevOpenedRow = row[index]
    }

    render() {
        const {
            index,
            visitedUserName,
            ownerName,
            homeFeedGoal,
            children,
            goalId,
            goalRef,
        } = this.props
        return (
            <>
                <CommentVideoModal
                    isVisible={this.state.videoModalVisible}
                    onClose={() => this.setState({ videoModalVisible: false })}
                    onRecordPress={this.openCameraRollBottomSheet}
                    pageId={this.props.pageId}
                    goalDetail={this.props.goalRef}
                />
                <Swipeable
                    renderRightActions={this.rightSwipeActions}
                    friction={2}
                    ref={(ref) => (row[index] = ref)}
                    leftThreshold={80}
                    rightThreshold={40}
                    onSwipeableRightOpen={() =>
                        this.setState({ swiperToolTipVisible: true })
                    }
                    onSwipeableOpen={() => this.closeRow(index)}
                >
                    {children}
                </Swipeable>
                {this.renderCameraRollBottomSheet()}
                {this.renderBottomVoiceRecording()}
                <AccountabilityPopUp
                    isVisible={this.state.accountPopUpVisible}
                    onClose={() =>
                        this.setState({ accountPopUpVisible: false })
                    }
                    name={getFirstName(
                        homeFeedGoal ? ownerName : visitedUserName
                    )}
                    goalId={goalId}
                />
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUserName = state.profile.user.name
    const { userId } = state.user
    const pageId = constructPageId('goal')
    // console.log('THIS IS PAGE IDDD', pageId)
    const { videoUri } = state.goalSwiper

    return {
        visitedUserName,
        userId,
        videoUri,
        // newComment: getNewCommentByTab(state, pageId),
        // pageId,
    }
}

export default connect(mapStateToProps, {
    openCameraForVideo,
    openCameraRollForVideo,
    refreshProfileData,
})(GoalSwiper)
