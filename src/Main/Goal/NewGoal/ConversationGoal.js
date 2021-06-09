/** @format */

import { connect } from 'react-redux'
import React, { Component } from 'react'

import {
    Text,
    View,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import NoGoalConversation from '../../../asset/image/Conversation.png'
import { getFirstName } from '../../../Utils/HelperMethods'
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png'
import ProfileImage from '../../Common/ProfileImage'
import { refreshProfileData } from '../../../actions'
import { submitGoal } from '../../../redux/modules/goal/CreateGoalActions'
import { Actions } from 'react-native-router-flux'
import { TouchableHighlight } from 'react-native-gesture-handler'

let pageAb

class ConversationGoal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: undefined,
            text: '',
        }
    }
    renderPictureByNudgeUser = (item) => {
        if (item.receiver.hasOwnProperty('profile')) {
            return item.receiver.profile.image
        } else {
            defaultUserProfile
        }
    }

    componentDidMount() {
        const { userId } = this.props
        const pageId = this.props.refreshProfileData(userId)
        pageAb = pageId
    }

    renderProfileImage() {
        const { item } = this.props

        return (
            <ProfileImage
                imageStyle={{ height: 50, width: 50 }}
                imageUrl={this.renderPictureByNudgeUser(item)}
            />
        )
    }

    handleCreate = () => {
        //Close keyboard no matter what
        Keyboard.dismiss()
        const { goal, userId } = this.props
        const goalId = goal ? goal._id : undefined
        const formValues = {
            steps: [{ isCompleted: false }],
            needs: [{ isCompleted: false }],
            shareToMastermind: true,
            category: 'General',
            privacy: 'friends',
            priority: 5,
            hasTimeline: false,
            startTime: { date: undefined, picker: false },
            endTime: { date: undefined, picker: false },
            title: this.state.text,
            tags: [],
            details: [{}],
        }
        return this.props.submitGoal(
            formValues,
            userId,
            false,
            () => {},

            goalId,
            {
                needOpenProfile,
            },
            pageAb
        )
    }

    render() {
        const { item } = this.props
        const { sender, questionToMakeFirstGoal, receiver } = item
        const senderFirstName = getFirstName(sender.name)
        const receiverFirstName = getFirstName(receiver.name)

        return (
            <>
                <SearchBarHeader />

                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
                            {this.renderProfileImage()}
                            <Text
                                style={{
                                    width: '75%',
                                    marginHorizontal: 12,
                                    fontSize: 16,
                                    lineHeight: 20,
                                    fontStyle: 'SFProDisplay-Regular',
                                }}
                            >
                                Hey {receiverFirstName}!
                                <Text
                                    style={{
                                        fontSize: 16,

                                        fontStyle: 'SFProDisplay-Regular',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {' '}
                                    {sender.name}{' '}
                                </Text>
                                {`wants to grow closer by knowing your goals! ${receiverFirstName} would like to know:`}
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
                                {questionToMakeFirstGoal}
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
                            After you answer {senderFirstName}'s question, set
                            it as your first goal!
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

                        <TouchableOpacity onPress={this.handleCreate}>
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
                        <TouchableOpacity
                            onPress={() => Actions.replace('drawer')}
                        >
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
                </TouchableWithoutFeedback>
            </>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { image } = state.user.user.profile
    const { userId } = state.user

    return {
        image,
        userId,
    }
}

export default connect(mapStateToProps, {
    refreshProfileData,
    submitGoal,
})(ConversationGoal)
