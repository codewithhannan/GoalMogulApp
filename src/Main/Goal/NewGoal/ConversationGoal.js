/** @format */

import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import { Image } from 'react-native-animatable'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import NoGoalConversation from '../../../asset/image/Conversation.png'

class ConversationGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: undefined,
            text: '',
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
                    <ImageBackground
                        source={NoGoalConversation}
                        style={{
                            width: 315,
                            height: 120,
                            alignSelf: 'center',
                            shadowOffset: { width: 6, height: 6 },
                            shadowColor: '#008DC8',
                            shadowOpacity: 0.1,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 16,
                                justifyContent: 'center',

                                alignSelf: 'center',
                                marginTop: 25,
                                color: '#008DC8',
                                fontWeight: '700',
                                width: '95%',
                                lineHeight: 21,
                            }}
                        >
                            If you had more time or energy, what is a really fun
                            or exciting activity you'd want to do with your
                            friends?
                        </Text>
                    </ImageBackground>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: '500',
                            textAlign: 'center',
                            width: '80%',
                            marginTop: 30,
                            alignSelf: 'center',
                        }}
                    >
                        After you answer Patricia's question, set it as your
                        first goal!
                    </Text>

                    <TextInput
                        multiline={true}
                        style={{
                            width: '85%',
                            height: 100,
                            borderWidth: 1,
                            alignSelf: 'center',
                            marginTop: 30,
                            borderRadius: 3,
                            padding: 10,
                            paddingTop: 10,
                            borderColor: '#E3E3E3',
                        }}
                        numberOfLines={4}
                        onChangeText={(text) => this.setState({ text })}
                        placeholder="Write the answer"
                        value={this.state.text}
                    />

                    <TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: '#42C0F5',
                                width: '50%',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                height: 40,
                                borderColor: '#42C0F5',
                                borderWidth: 1,
                                borderRadius: 3,
                                marginTop: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: 14,
                                    fontStyle: 'SFProDisplay-Regular',
                                    textAlign: 'center',
                                }}
                            >
                                Create Goal
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View
                            style={{
                                backgroundColor: '#E3E3E3',
                                width: '50%',
                                justifyContent: 'center',
                                alignSelf: 'center',
                                height: 40,
                                borderColor: '#E3E3E3',
                                borderWidth: 1,
                                borderRadius: 3,
                                marginTop: 20,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: 14,
                                    fontStyle: 'SFProDisplay-Regular',
                                    textAlign: 'center',
                                }}
                            >
                                Ignore
                            </Text>
                        </View>
                    </TouchableOpacity>
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
