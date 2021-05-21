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
import { Icon } from '@ui-kitten/components'
import { Entypo } from '@expo/vector-icons'
import Constants from 'expo-constants'
import { color, default_style } from '../styles/basic'
import OnboardingStyles from '../styles/Onboarding'

import { IMAGE_BASE_URL } from '../Utils/Constants'
import { connect } from 'react-redux'

import { getUserData } from '../redux/modules/User/Selector'
import { getData } from '../store/storage'

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

    render() {
        const { image } = this.props

        // let ImageSource = { currentImage: require(image) }
        // console.log('IMAFGE SOURCE', ImageSource)
        return (
            <>
                <Modal
                    backdropOpacity={0.8}
                    isVisible={this.props.isVisible}
                    animationIn="zoomInUp"
                    animationOut="zoomOutDown"
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

                                backgroundColor: color.GV_MODAL,
                                height: MODAL_HEIGHT * 0.7,
                                backgroundColor: 'transparent',
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    padding: 13,
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
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                    }}
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
                            </View>
                            <View
                                style={{
                                    width: '100%',
                                    bottom: 15,
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

export default connect(mapStateToProps, {})(ProfilePictureModal)
