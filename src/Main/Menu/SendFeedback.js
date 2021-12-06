/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    TextInput,
} from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { connect } from 'react-redux'
import { color } from '../../styles/basic'
import { Image } from 'react-native-animatable'
import { BlurView } from 'expo-blur'

import { Formik } from 'formik'

import * as _ from 'underscore'
import FeedbackScreenShot from '../../asset/background/FeedbackScreenShot.png'
import { api as API } from '../../redux/middleware/api'
import SearchBarHeader from '../Common/Header/SearchBarHeader'

import FeedBackCard from './FeedBackCard'
import { DEVICE_PLATFORM } from '../../Utils/Constants'
import { getBottomSpace } from 'react-native-iphone-x-helper'
import { Actions } from 'react-native-router-flux'

import DelayedButton from '../Common/Button/DelayedButton'
import OnboardingStyles from '../../styles/Onboarding'
import EmptyResult from '../Common/Text/EmptyResult'
import {
    openFeedBackCameraRoll,
    sendFeedbackImages,
} from '../../actions/FeedbackActions'

import FeedbackModal from '../Common/Modal/FeedbackModal'
import { ActivityIndicator } from 'react-native-paper'

const { text: textStyle, button: buttonStyle } = OnboardingStyles
const screenHeight = Dimensions.get('screen').height
const DEBUGKEY = ['Feedback Screen']

class SendFeedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{}, {}, {}],
            feedbackModalVisible: false,
            description: '',
            disable: false,
        }
    }

    showFeedBackModal = () => this.setState({ feedbackModalVisible: true })

    onNext = (description) => {
        const showModal = () => {
            this.showFeedBackModal()
        }

        return (
            this.props.sendFeedbackImages(description, showModal),
            this.setState({ disable: true })
        )
    }

    closeFeedbackModal = () => {
        return (
            this.setState({ feedbackModalVisible: false }),
            setTimeout(() => {
                Actions.pop()
            }, 600)
        )
    }

    openCameraRoll = () => {
        this.props.openFeedBackCameraRoll(null, null, null)
    }

    renderItem = ({ item, index }) => {
        return <FeedBackCard item={item} index={index} />
    }
    lisHeaderComponent = () => {
        return (
            <>
                <View
                    style={{
                        padding: 10,
                        marginHorizontal: 10,
                    }}
                >
                    <Text
                        style={{
                            color: '#505050',
                            fontSize: 16,
                            fontWeight: '600',
                        }}
                    >
                        Uploaded Screenshots
                    </Text>
                </View>
                <View style={{ marginTop: 10 }} />
            </>
        )
    }

    itemSeperatorComponent = () => {
        return (
            <View
                style={{
                    borderWidth: 0.5,
                    borderColor: '#F1EEEE',
                }}
            ></View>
        )
    }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: color.GM_CARD_BACKGROUND,
                }}
            >
                <FeedbackModal
                    isVisible={this.state.feedbackModalVisible}
                    isClose={this.closeFeedbackModal}
                />
                <SearchBarHeader title={'Give Feedback'} backButton />
                <KeyboardAwareScrollView
                    bounces={false}
                    // enableOnAndroid={true}
                    // enableAutomaticScroll={DEVICE_PLATFORM === 'ios'}
                    contentContainerStyle={[
                        {
                            paddingBottom: getBottomSpace(),
                        },
                    ]}
                    innerRef={(ref) => (this.scrollView = ref)}
                >
                    <TouchableOpacity onPress={this.openCameraRoll}>
                        <View
                            style={{
                                alignSelf: 'center',
                                height: 200,
                                marginTop: 25,
                                width: '90%',
                                marginBottom: 10,
                                borderWidth: 2,
                                borderStyle: 'dashed',
                                borderColor: '#42C0F5',
                                borderTopColor: '#42C0F5',
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={FeedbackScreenShot}
                                resizeMode="contain"
                                style={{ marginBottom: 10 }}
                            />

                            <Text
                                style={{
                                    fontSize: 14,
                                    color: '#42C0F5',
                                    fontWeight: '600',
                                }}
                            >
                                Attach Screenshot
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.textAreaContainer}>
                        <TextInput
                            multiline={true}
                            style={styles.textArea}
                            textAlign="left"
                            keyboardType="default"
                            numberOfLines={10}
                            onChangeText={(description) =>
                                this.setState({ description })
                            }
                            value={this.state.description}
                            placeholder="Describe the issue you're having"
                        />
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.props.feedback}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.lisHeaderComponent}
                        listKey={Math.random().toString(36).substr(2, 9)}
                        onEndReachedThreshold={0}
                        ItemSeparatorComponent={this.itemSeperatorComponent}
                        // ListEmptyComponent={() => {
                        //     return (
                        //         <EmptyResult
                        //             text="No Screenshot Attached"
                        //             textStyle={{
                        //                 paddingTop: 65,
                        //             }}
                        //         />
                        //     )
                        // }}
                    />

                    <DelayedButton
                        disabled={
                            this.state.description == '' || this.state.disable
                        }
                        style={[
                            buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                .containerStyle,
                            {
                                // marginBottom: 5,
                                backgroundColor:
                                    this.state.description == '' ||
                                    this.state.disable
                                        ? color.GM_BLUE_LIGHT
                                        : color.GM_BLUE,
                                width: '90%',
                                height: 35,
                                alignSelf: 'center',
                                justifyContent: 'center',
                            },
                        ]}
                        onPress={() => {
                            return this.onNext(this.state.description)
                        }}
                    >
                        <Text
                            style={[
                                buttonStyle.GM_BLUE_BG_WHITE_BOLD_TEXT
                                    .textStyle,
                                {
                                    // marginBottom: 5,
                                    backgroundColor:
                                        this.state.description == '' ||
                                        this.state.disable
                                            ? color.GM_BLUE_LIGHT
                                            : color.GM_BLUE,
                                    width: '90%',
                                    textAlign: 'center',
                                },
                            ]}
                            onPress={() => {
                                return this.onNext(this.state.description)
                            }}
                        >
                            Send
                        </Text>
                    </DelayedButton>
                </KeyboardAwareScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textAreaContainer: {
        borderWidth: 1,
        padding: 5,
        borderColor: '#D3D3D3',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 3,
        marginTop: 10,
    },
    textArea: {
        height: 150,
        justifyContent: 'center',
    },
    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
})

const mapStateToProps = (state, props) => {
    const { token } = state.auth.user
    const feedback = state.feedback.feedBackimages

    return {
        token,
        feedback,
    }
}

export default connect(mapStateToProps, {
    openFeedBackCameraRoll,

    sendFeedbackImages,
})(SendFeedback)
