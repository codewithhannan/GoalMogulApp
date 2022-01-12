/** @format */

// /** @format */

import React, { useState, Component } from 'react'
import { Button, Text, View, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

styles
// import TimePic from './TimePic'
import Tooltip from '../../Main/Common/Tooltip'
import ProfileImage from '../Common/ProfileImage'
import Headline from '../Goal/Common/Headline'
import TimePickers from './TimePickers'
import Constants from 'expo-constants'

//Assets
import SWIPER_BACKGROUND from '../../asset/image/tooltip3.png'
import FriendsIcon from '../../asset/utils/friends.png'

//Actions
import { getProfileImageOrDefaultFromUser } from '../../redux/middleware/utils'
import { setVideoFromCameraUri } from '../../reducers/ProfileGoalSwipeReducer'
import { connect } from 'react-redux'

const tooltipText = `You can change your check-in's anytime by opening your 'Settings' menu from the main screen and tapping 'Accountability'.`

class CalenderModel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isModalVisible: false,
            selectedDays: [],
        }
    }

    handleConfirmButton = () => {}

    render() {
        return (
            <>
                {/* {isModalVisible && (
                <Tooltip
                    title={tooltipText}
                    imageSource={SWIPER_BACKGROUND}
                    type="commentSuggestion"
                    viewStyle={{
                        position: 'absolute',
                        zIndex: 100,
                        left: 100,
                        top: 150,
                        // bottom: 15,
                    }}
                    bgStyle={{ width: 248, height: 103 }}
                />
            )} */}
                <Modal
                    backdropColor={'black'}
                    propagateSwipe
                    backdropOpacity={0.6}
                    isVisible={this.props.isVisible}
                    onBackdropPress={() => this.props.onClose()}
                    onSwipeComplete={() => this.props.onClose()}
                    swipeDirection={'down'}
                    style={{
                        marginTop: Constants.statusBarHeight + 20,
                        borderRadius: 15,
                        margin: 0,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            position: 'absolute',
                            width: '100%',
                            bottom: 0,
                            borderRadius: 5,
                        }}
                    >
                        <View
                            style={{
                                ...styles.modalContainerStyle,
                                height: hp(70),
                            }}
                        >
                            <View
                                style={{
                                    marginVertical: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                <View
                                    style={{
                                        width: 50,
                                        height: 4,
                                        borderRadius: 5,
                                        backgroundColor: 'lightgray',
                                    }}
                                />
                            </View>

                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 15,
                                    top: 10,
                                }}
                                onPress={() => this.props.onClose()}
                            >
                                <Image
                                    style={{
                                        width: 25,
                                        height: 25,
                                        resizeMode: 'contain',
                                    }}
                                    source={require('../../asset/icons/cross.png')}
                                />
                            </TouchableOpacity>
                            <View
                                style={{
                                    marginHorizontal: 10,
                                }}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <ProfileImage
                                        imageStyle={{ width: 50, height: 50 }}
                                        imageUrl={getProfileImageOrDefaultFromUser()}
                                        imageContainerStyle={{
                                            backgroundColor: 'white',
                                        }}
                                        disabled
                                    />
                                    <View style={{ marginHorizontal: 15 }}>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                color: '#3B414B',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Patricia Tsai
                                        </Text>
                                        <View
                                            style={{
                                                width: 80,
                                                height: 25,
                                                borderRadius: 15,
                                                marginVertical: 5,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: 'lightgray',
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <Image
                                                source={FriendsIcon}
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                    margin: 5,
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Friends
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '500',
                                        marginTop: 15,
                                    }}
                                >
                                    When do you want to be reminded to check in
                                    with Patricia?
                                </Text>
                            </View>
                            <TimePickers />
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#42C0F5',
                                    width: '90%',
                                    justifyContent: 'center',
                                    alignSelf: 'center',
                                    height: 40,
                                    borderColor: '#42C0F5',
                                    borderWidth: 2,
                                    borderRadius: 5,
                                    marginBottom: 15,
                                }}
                                // onPress={handleConfirmButton}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: '500',
                                    }}
                                >
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const accountability = state.accountabilityTime

    return {
        accountability,
    }
}
export default connect(mapStateToProps, {})(CalenderModel)

const styles = {
    modalContainerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: wp(4.26),
        borderRadius: 15,
        padding: 5,
    },
}
