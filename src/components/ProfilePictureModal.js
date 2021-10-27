/** @format */

import React, { Component } from 'react'
import {
    Button,
    Text,
    View,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
} from 'react-native'
import Modal from 'react-native-modal'
import R from 'ramda'
import * as ImagePicker from 'expo-image-picker'
import { Icon } from '@ui-kitten/components'
import { Entypo } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { color, default_style } from '../styles/basic'
import OnboardingStyles from '../styles/Onboarding'

import { IMAGE_BASE_URL } from '../Utils/Constants'
import { connect } from 'react-redux'

import { getUserData } from '../redux/modules/User/Selector'
import { getData } from '../store/storage'
import {
    actionSheet,
    switchByButtonIndex,
} from '../Main/Common/ActionSheetFactory'
import { updateProfilePic } from '../actions'

import defaultUserProfile from '../asset/utils/defaultUserProfile.png'

const MODAL_WIDTH = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height

class ProfilePictureModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            imageUrl: undefined,
        }
    }

    async componentDidMount() {
        const { image } = this.props.user.profile

        if (image) {
            this.prefetchImage(image)
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        let prevImageUrl = ''
        if (
            prevProps.user &&
            prevProps.user.profile &&
            prevProps.user.profile.image
        ) {
            prevImageUrl = `${IMAGE_BASE_URL}${prevProps.user.profile.image}`
        }

        if (
            this.props.user &&
            this.props.user.profile &&
            this.props.user.profile.image
        ) {
            const { image } = this.props.user.profile
            const imageUrl = `${IMAGE_BASE_URL}${image}`
            if (imageUrl !== this.state.imageUrl || imageUrl !== prevImageUrl) {
                this.prefetchImage(image)
                // console.log(`prefetching image, imageUrl: ${imageUrl}, prevImageUrl: ${prevImageUrl}`);
            }
        }
        // console.log('this is imagee', this.state.imageUrl)
    }

    prefetchImage(image) {
        const fullImageUrl = `${IMAGE_BASE_URL}${image}`
        this.setState({
            imageUrl: fullImageUrl,
        })
        Image.prefetch(fullImageUrl)
    }

    renderProfileImage() {
        if (this.state.imageUrl == undefined) {
            return require('../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: this.state.imageUrl }
        }
    }

    pickImage = () => {
        let res
        console.log('THIS IS PROFILE IMAGE')
        try {
            this.props.onClose()
            setTimeout(async () => {
                res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                })
                this.props.updateProfilePic(res.uri, this.props.pageId)
                this.props.isVisible()
            }, 500)
        } catch (err) {
            console.log(
                '\nError while selecting image from device: ',
                err.message
            )
        }
        if (!res.cancelled) {
            this.setState({ imageUrl: res.uri })
        }
    }

    handleOptionsOnPress() {
        const options = switchByButtonIndex([
            [
                R.equals(0),
                () => {
                    console.log(
                        ` User chooses to change profile pitrue`,
                        '',
                        this.pickImage()
                    )
                },
            ],
        ])

        const requestOptions = ['Update Profile Picture', 'Cancel']

        const cancelIndex = 1

        const adminActionSheet = actionSheet(
            requestOptions,
            cancelIndex,
            options
        )
        adminActionSheet()
    }

    render() {
        // let ImageSource = { currentImage: require(image) }
        // console.log('IMAFGE SOURCE', ImageSource)
        return (
            <>
                <Modal
                    backdropOpacity={1}
                    isVisible={this.props.isVisible}
                    animationIn="zoomInUp"
                    animationInTiming={400}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: MODAL_WIDTH,

                                // backgroundColor: color.GV_MODAL,
                                height: MODAL_HEIGHT * 0.9,
                                backgroundColor: 'transparent',
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    padding: 13,
                                    // paddingVertical: 10,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.onClose()}
                                >
                                    <View
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: 50,
                                            height: 28,
                                            width: 28,
                                            position: 'absolute',
                                            left: 0,
                                        }}
                                    />

                                    <Entypo
                                        name="cross"
                                        size={27}
                                        color="#001D29"
                                    />
                                </TouchableOpacity>
                                {/* {this.props.isSelf ? (
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        style={{
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                        }}
                                        onPress={() =>
                                            this.handleOptionsOnPress()
                                        }
                                    >
                                        <Icon
                                            name="dots-horizontal"
                                            pack="material-community"
                                            style={[
                                                {
                                                    tintColor: 'white',
                                                    width: 33,
                                                    height: 33,
                                                },
                                            ]}
                                        />
                                    </TouchableOpacity>
                                ) : null} */}
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    // bottom: 15,
                                }}
                            >
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '90%',
                                        resizeMode: 'contain',
                                    }}
                                    source={this.renderProfileImage()}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const visitedUser = state.profile.userId.userId
    const { token } = state.auth.user
    const { profile } = state.profile.user
    const { userId } = props

    const userObject = getUserData(state, userId, '')
    const { user } = userObject

    return {
        visitedUser,
        token,

        user,
    }
}

export default connect(mapStateToProps, { updateProfilePic })(
    ProfilePictureModal
)
