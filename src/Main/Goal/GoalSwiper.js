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
            {
                id: 1,
                source: ACCOUNTABILITY,
                onPress: () => {
                    prevOpenedRow.close()
                    this.setState({ accountPopUpVisible: true })
                },
                backgroundColor: '#CEFFBC',
            },

            {
                id: 3,
                source: RECORDING,
                onPress: () => {
                    prevOpenedRow.close()
                    this.openRecordingModal()
                },
                backgroundColor: '#D7F3FF',
            },
            {
                id: 2,
                source: VIDEO,
                onPress: () => this.openCameraRollBottomSheet(),
                backgroundColor: '#E5F7FF',
            },
        ]
    }

    showVideoModal = () => this.setState({ videoModalVisible: true })
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
        const sheetHeight = getButtonBottomSheetHeight(5.35)
        return (
            <BottomButtonsSheet
                ref={(r) => (this.bottomRecodingSheet = r)}
                buttons={[{}]}
                height={sheetHeight}
                chatRecordingPress
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
        const { margin } = this.props
        return (
            <>
                {this.state.swiperToolTipVisible && this.props.index == 0 ? (
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
                ) : null}

                {this.SWIPED_DATA.map((item, index) => {
                    return (
                        <TouchableOpacity
                            onPress={item.onPress}
                            key={index}
                            activeOpacity={0.7}
                            style={{
                                backgroundColor: item.backgroundColor,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                height: '98%',
                                marginTop: margin,
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
        const { index, visitedUserName, ownerName } = this.props
        return (
            <>
                <CommentVideoModal
                    isVisible={this.state.videoModalVisible}
                    onClose={() => this.setState({ videoModalVisible: false })}
                    onRecordPress={this.openCameraRollBottomSheet}
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
                    onSwipeableOpen={this.closeRow(index)}
                >
                    {this.props.children}
                </Swipeable>
                {this.renderCameraRollBottomSheet()}
                {this.renderBottomVoiceRecording()}
                <AccountabilityPopUp
                    isVisible={this.state.accountPopUpVisible}
                    onClose={() =>
                        this.setState({ accountPopUpVisible: false })
                    }
                    // name={getFirstName(
                    //     visitedUserName == undefined
                    //         ? ownerName
                    //         : visitedUserName
                    // )}
                />
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUserName = state.profile.user.name

    return {
        visitedUserName,
    }
}

export default connect(mapStateToProps, {
    openCameraForVideo,
    openCameraRollForVideo,
})(GoalSwiper)
