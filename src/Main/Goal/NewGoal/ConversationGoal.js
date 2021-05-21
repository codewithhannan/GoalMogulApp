/** @format */

import { connect } from 'react-redux'
import React, { Component } from 'react'

import { Text, View } from 'react-native'
import { Image } from 'react-native-animatable'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import OnboardingHeader from '../../Onboarding/Common/OnboardingHeader'

class ConversationGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: undefined,
        }
    }

    async componentDidMount() {
        const { image } = this.props

        console.log('THIS IS IMAGE', this.state.imageUrl)

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

    renderProfileImage() {
        if (this.state.imageUrl == undefined) {
            return require('../../../asset/utils/defaultUserProfile.png')
        } else {
            return { uri: this.state.imageUrl }
        }
    }

    prefetchImage(image) {
        const fullImageUrl = `${IMAGE_BASE_URL}${image}`
        this.setState({
            imageUrl: fullImageUrl,
        })
        Image.prefetch(fullImageUrl)
    }

    render() {
        return (
            <>
                <SearchBarHeader />

                <View
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            padding: 15,
                            flexDirection: 'row',
                            marginTop: 10,
                        }}
                    >
                        <Image
                            source={this.renderProfileImage()}
                            style={{
                                height: 50,
                                width: 50,
                                borderRadius: 150 / 2,
                                overflow: 'hidden',
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                width: '75%',
                                marginHorizontal: 12,
                                fontSize: 16,
                                lineHeight: 20,
                                fontStyle: 'SFProDisplay-Regular',
                            }}
                        >
                            Hey Shunsuke!
                            <Text
                                style={{
                                    fontSize: 16,

                                    fontStyle: 'SFProDisplay-Regular',
                                    fontWeight: 'bold',
                                }}
                            >
                                {' '}
                                Patricia Tsai{' '}
                            </Text>
                            wants to grow closer by knowing your goals! Patricia
                            would like to know:
                        </Text>
                    </View>

                    <View
                        style={{
                            width: 307,
                            height: 95,
                            borderRadius: 4,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            elevation: 5,
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <Text>hanan</Text>
                        </View>
                    </View>
                </View>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { image } = state.user.user.profile

    return {
        image,
    }
}

export default connect(mapStateToProps, {})(ConversationGoal)
