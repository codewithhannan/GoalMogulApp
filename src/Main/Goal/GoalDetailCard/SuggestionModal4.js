/**
 * This suggestion modal is decided on ms2 polish notes.
 * Changes:
 * 1. It has only 6 categories
 * 2. Goal preview is on top
 * 3. Options are obfuscated on select with animation and then show relevant page
 *    on below
 *
 * @format
 */

import React, { Component } from 'react'
import {
    View,
    Text,
    Modal,
    Image,
    TouchableOpacity,
    Animated,
    Alert,
    Keyboard,
    Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import _ from 'lodash'
// import RNModal from 'react-native-modal'
import RNModal from 'react-native-modalbox'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader'
import SearchSuggestion from './Suggestion/SearchSuggestion'
import GeneralSuggestion from './Suggestion/GeneralSuggestion'
import NeedStepSuggestion from './Suggestion/NeedStepSuggestion'
import SuggestionGoalPreview from './Suggestion/SuggestionGoalPreview'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import InviteFriendModal from '../../MeetTab/Modal/InviteFriendModal'
// Asset
// import Book from '../../../asset/suggestion/book.png';
import Chat from '../../../asset/suggestion/chat.png'
import Event from '../../../asset/suggestion/event.png'
import Flag from '../../../asset/suggestion/flag.png'
import Friend from '../../../asset/suggestion/friend.png'
// import Group from '../../../asset/suggestion/group.png';
// import Link from '../../../asset/suggestion/link.png';
import Other from '../../../asset/suggestion/other.png'
// import HelpIcon from '../../../asset/utils/help.png';
import StepIcon from '../../../asset/utils/steps.png'
import user from '../../../asset/suggestion/user.png'
import contact from '../../../asset/suggestion/contact.png'
import step from '../../../asset/suggestion/step.png'
import need from '../../../asset/suggestion/need.png'
import tribe from '../../../asset/suggestion/tribe.png'

// Actions
import {
    updateSuggestionType,
    cancelSuggestion,
} from '../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'

import { refreshPreloadData } from '../../../redux/modules/feed/comment/SuggestionSearchActions'

// Utils function
import { switchCase } from '../../../redux/middleware/utils'
import { Logger } from '../../../redux/middleware/utils/Logger'

const DEBUG_KEY = '[ UI SuggestionModal3 ]'
const OPTIONS_HEIGHT = 120
const OPTIONS_OPACITY = 0.001
const { width, height } = Dimensions.get('window')

class SuggestionModal extends Component {
    constructor(props) {
        super(props)
        this.fadeHeight = new Animated.Value(OPTIONS_HEIGHT)
        this.fadeOpacity = new Animated.Value(1)
        this.suggestionOpacity = new Animated.Value(0.001)
        this.state = {
            query: '',
            // iconMapRight: [...IconMapRight],
            iconMapLeft: [...IconMapLeft],
            optionsCollapsed: false,
            optionsHeight: 150,
            modalVisible: false,
            showInviteFriendModal: false,
            showNeedStepModal: false,
            isSelected: false,
        }
    }

    componentDidMount() {
        // Sending request to fetch pre-populated data
        Logger.log(`${DEBUG_KEY}: [ componentDidMount ]`, {}, 2)
        this.props.refreshPreloadData('User')
        // this.props.refreshPreloadData('Event')
        this.props.refreshPreloadData('Tribe')
        // this.props.refreshPreloadData('ChatConvoRoom')
    }

    handleExpand = () => {
        Animated.parallel([
            Animated.timing(this.fadeHeight, {
                useNativeDriver: false,
                duration: 100,
                toValue: OPTIONS_HEIGHT,
            }),
            Animated.timing(this.fadeOpacity, {
                useNativeDriver: false,
                duration: 100,
                toValue: 1,
            }),
            Animated.timing(this.suggestionOpacity, {
                useNativeDriver: false,
                duration: 100,
                toValue: 0.001,
            }),
        ]).start(() => {
            this.setState({
                optionsCollapsed: false,
            })
        })
    }

    handleCollapse = () => {
        Animated.parallel([
            Animated.timing(this.fadeHeight, {
                useNativeDriver: false,
                duration: 100,
                toValue: 0,
            }),
            Animated.timing(this.fadeOpacity, {
                useNativeDriver: false,
                duration: 100,
                toValue: OPTIONS_OPACITY,
            }),
            Animated.timing(this.suggestionOpacity, {
                useNativeDriver: false,
                duration: 100,
                toValue: 1,
            }),
        ]).start(() => {
            this.setState({
                optionsCollapsed: true,
            })
        })
    }

    // On modal dismiss, reset iconmap state
    resetIconMap = () => {
        this.handleExpand()
        this.setState({
            ...this.state,
            // iconMapRight: [...IconMapRight],
            iconMapLeft: [...IconMapLeft],
            // modalVisible: false,
        })
    }

    // Update icon map with selected options
    updateIconMap = (suggestionType) => {
        this.props.updateSuggestionType(suggestionType, this.props.pageId)
        const { iconMapLeft } = this.state
        // const newIconMapRight = updateIconMap(suggestionType, iconMapRight)
        const newIconMapLeft = updateIconMap(suggestionType, iconMapLeft)

        this.setState({
            ...this.state,
            // iconMapRight: newIconMapRight,
            iconMapLeft: newIconMapLeft,
        })
        if (suggestionType === 'User' || suggestionType === 'Tribe') {
            this.setState({ modalVisible: true })
        }
        if (suggestionType === 'Contact') {
            // this.setState({ showInviteFriendModal: true })
            Actions.push('ContactMessage')
        }

        if (suggestionType === 'NewNeed' || suggestionType === 'NewStep') {
            this.setState({ modalVisible: true })
        }

        // this.handleCollapse()
    }

    renderGoalPreview(item) {
        return <SuggestionGoalPreview item={item} />
    }

    renderSuggestionFor(newComment, goal) {
        const { suggestionFor, suggestionForRef } = newComment.tmpSuggestion
        const { stepRef, needRef } = newComment
        return (
            <SuggestedItem
                type={suggestionFor}
                suggestionForRef={suggestionForRef}
                goal={goal}
                stepRef={stepRef}
                needRef={needRef}
            />
        )
    }

    renderOptions(newComment) {
        const { suggestionType } = newComment.tmpSuggestion
        const { iconMapLeft, optionsCollapsed } = this.state

        // const optionsRight = (
        //     <Options iconMap={iconMapRight} onPress={this.updateIconMap} />
        // )

        const optionsLeft = (
            <Options iconMap={iconMapLeft} onPress={this.updateIconMap} />
        )

        const optionsCollapsedText = optionsCollapsed ? (
            <TouchableOpacity
                activeOpacity={0.6}
                style={{ width: 50, justifyContent: 'center' }}
                onPress={this.handleExpand}
            >
                <Text style={styles.optionsCollapsedTextStyle}>Back</Text>
            </TouchableOpacity>
        ) : null
        // (
        //   <TouchableOpacity activeOpacity={0.6}
        //     style={{ width: 50, justifyContent: 'center' }}
        //     onPress={this.handleCollapse}
        //   >
        //     <Text style={styles.optionsCollapsedTextStyle}>Collapse</Text>
        //   </TouchableOpacity>
        // );

        const suggestionForTextArray = switchCaseForSuggestionForText(
            suggestionType
        )
        let suggestionForText = []
        suggestionForTextArray.forEach((w, index) => {
            if (
                index === suggestionForTextArray.length - 1 &&
                suggestionForTextArray.length > 1
            ) {
                // console.log(`${DEBUG_KEY}: i am here`);
                suggestionForText.push(
                    <Text
                        style={{ fontWeight: '700' }}
                        key={Math.random().toString(36).substr(2, 9)}
                    >
                        {w}
                    </Text>
                )
            } else {
                suggestionForText.push(
                    <Text key={Math.random().toString(36).substr(2, 9)}>
                        {w}{' '}
                    </Text>
                )
            }
        })

        return (
            <View style={styles.optionsContainerStyle}>
                <View
                    style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                    {optionsCollapsedText}
                    <View
                        style={{
                            flex: 1,
                            marginVertical: 10,
                            marginHorizontal: 25,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: 'bold',
                                // alignSelf: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            Suggest a:
                        </Text>
                    </View>

                    {/* {optionsCollapsed ? <View style={{ width: 50 }} /> : null} */}
                </View>
                <View
                    style={{
                        width: hp('100%'),
                        height: 2,
                        backgroundColor: 'lightgray',
                    }}
                />
                <Animated.View
                    style={{
                        flexDirection: 'row',
                        height: this.fadeHeight,
                        opacity: this.fadeOpacity,
                    }}
                >
                    {optionsLeft}
                    {/* {optionsRight} */}
                </Animated.View>
            </View>
        )
    }

    setSelected(val) {
        // if (val) this.setState({ isSelected: true })
    }

    renderSuggestionBody(newComment) {
        const {
            suggestionType,
            selectedItem,
            suggestionText,
        } = newComment.tmpSuggestion
        // if (!this.state.optionsCollapsed) return null
        if (
            suggestionType === 'User' ||
            suggestionType === '' ||
            suggestionType === 'Event' ||
            suggestionType === 'Tribe' ||
            suggestionType === 'ChatConvoRoom'
        ) {
            return (
                <>
                    <ModalHeader
                        title={suggestionType === 'User' ? 'Friends' : 'Tribes'}
                        back
                        onCancel={() => {
                            // this.props.onCancel()
                            this.resetIconMap()
                            this.setState({ modalVisible: false })
                        }}
                    />
                    <SearchSuggestion
                        pageId={this.props.pageId}
                        opacity={this.suggestionOpacity}
                        onCancel={() => {
                            Keyboard.dismiss()
                        }}
                        onSelect={() => {
                            // Right now don't turn on this
                            // this.scrollview.props.scrollToPosition(0, 0);
                        }}
                        onFocus={() => {
                            this.scrollview.props.scrollToPosition(0, 120)
                        }}
                    />
                    <TouchableOpacity
                        style={{}}
                        onPress={() => {
                            this.props.onAttach()
                            this.resetIconMap()
                            // this.handleExpand()
                            if (!selectedItem) {
                                this.setState({ modalVisible: true })
                            } else {
                                this.setState({ modalVisible: false })
                            }
                        }}
                    >
                        <View style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Done</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )
        }
        if (suggestionType === 'NewNeed' || suggestionType === 'NewStep') {
            return (
                <>
                    <ModalHeader
                        title={
                            suggestionType === 'NewNeed'
                                ? 'Suggest a Need'
                                : 'Suggest a Step'
                        }
                        back
                        onCancel={() => {
                            // this.props.onCancel()
                            this.resetIconMap()
                            this.setState({ modalVisible: false })
                        }}
                    />
                    {/* <View style={{ flex: 1 }}> */}
                    <NeedStepSuggestion
                        item={this.props.item}
                        pageId={this.props.pageId}
                        goalId={this.props.goalId}
                        opacity={this.suggestionOpacity}
                    />
                    {/* </View> */}
                    <TouchableOpacity
                        style={styles.buttonContainer}
                        onPress={() => {
                            this.props.onAttach()
                            this.resetIconMap()
                            // this.handleExpand()
                            if (!suggestionText) {
                                this.setState({ modalVisible: true })
                            } else {
                                this.setState({ modalVisible: false })
                            }
                        }}
                    >
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </>
            )
        }

        return null
    }

    closeInviteFriendModal = () => {
        // this.props.onCancel()
        this.resetIconMap()
        this.setState({ ...this.state, showInviteFriendModal: false })
    }

    render() {
        const { newComment, item, setSubSuggestionModal } = this.props
        if (!newComment || !item) return null
        return (
            <RNModal
                isOpen={this.props.visible}
                onClosed={this.props.onCancel}
                useNativeDriver={false}
                style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        height: 360,
                        position: 'absolute',
                        bottom: 0,
                    }}
                >
                    <View
                        style={{
                            marginVertical: 5,
                            width: 30,
                            height: 3,
                            borderRadius: 5,
                            alignSelf: 'center',
                            backgroundColor: 'lightgray',
                        }}
                    />
                    {/* {this.renderGoalPreview(item)} */}
                    {/* {this.renderSuggestionFor(newComment, item)} */}
                    {this.renderOptions(newComment)}
                </View>
                <Modal
                    visible={this.state.modalVisible}
                    onClosed={() => setSubSuggestionModal(false)}
                    animationType="slide"
                >
                    {this.renderSuggestionBody(newComment)}
                </Modal>
                <InviteFriendModal
                    pageId={this.props.pageId}
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                    goalTosend={`My friend ${this.props.name} has the goal ${this.props.title} I thought you might be able to help. Please join us on GoalMogul so I can connect you!`}
                    shouldOpenFromComments
                />
            </RNModal>
        )
    }
}

// Legacy usage of KeyboardAvoidingView
// <ScrollView>
//   <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>

const styles = {
    // Options style
    selectedSuggestionIconStyle: {
        // tintColor: '#17B3EC',
        height: 25,
        width: 25,
    },
    suggestionIconStyle: {
        // tintColor: '#b8c7cb',
        height: 25,
        width: 25,
    },
    selectedSuggestionTextStyle: {
        color: '#535353',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 15,
    },
    suggestionTextStyle: {
        color: '#535353',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 15,
    },
    optionsCollapsedTextStyle: {
        color: '#17B3EC',
        fontSize: 12,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    optionsContainerStyle: {
        // backgroundColor: 'white',
        // marginTop: 0.5,
        // marginLeft: 15,
        // marginRight: 15,
        // borderBottomColor: 'lightgray',
        // borderBottomWidth: 0.5,
        // paddingBottom: 5,
    },
    buttonContainer: {
        backgroundColor: '#42C0F5',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderColor: '#42C0F5',
        borderWidth: 2,
        borderRadius: 5,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        // fontStyle: 'SFProDisplay-Regular',
    },
}

const switchCaseForSuggestionForText = (suggestionType) =>
    switchCase({
        User: ['a', 'User'],
        ChatConvoRoom: ['a', 'Chat room'],
        NewNeed: ['a', 'Need'],
        NewStep: ['a', 'Step'],
        Event: ['an', 'Event'],
        Tribe: ['a', 'Tribe'],
    })(['a...'])(suggestionType)

// IconMapLeft: ["Person", "ChatConvoRoom", "Step or Need"],
// IconMapRight: ["Event", "Tribe", "Custom"]
const IconMapLeft = [
    {
        key: 'User',
        text: 'User',
        value: {
            iconSource: user,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Contact',
        text: 'Contact',
        value: {
            iconSource: contact,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'NewStep',
        text: 'Step',
        value: {
            iconSource: step,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'NewNeed',
        text: 'Need',
        value: {
            iconSource: need,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Tribe',
        text: 'Tribe',
        value: {
            iconSource: tribe,
            iconStyle: {},
        },
        selected: undefined,
    },
]

// const IconMapRight = [
//     {
//         key: 'Need',
//         text: 'Need',
//         value: {
//             iconSource: need,
//             iconStyle: {},
//         },
//         selected: undefined,
//     },
//     {
//         key: 'Tribe',
//         text: 'Tribe',
//         value: {
//             iconSource: Flag,
//             iconStyle: {},
//         },
//         selected: undefined,
//     },
//     {
//         key: 'Custom',
//         text: 'Custom',
//         value: {
//             iconSource: Other,
//             iconStyle: {},
//         },
//         selected: undefined,
//     },
// ]

const updateIconMap = (suggestionType, iconMap) =>
    iconMap.map((item) => {
        const newItem = _.cloneDeep(item)
        newItem.selected = suggestionType === item.key
        return newItem
    })

/**
 * Render one column of options
 */
const Options = (props) => {
    const { iconMap, onPress } = props
    const options = iconMap.map((icon) => {
        const { text, value, key, selected } = icon
        const { iconSource, iconStyle } = value
        // Update Icon style if selected
        const style = selected
            ? {
                  ...styles.selectedSuggestionIconStyle,
                  ...iconStyle,
              }
            : {
                  ...styles.suggestionIconStyle,
                  ...iconStyle,
              }

        // Update text style if selected
        const textStyle = selected
            ? { ...styles.selectedSuggestionTextStyle }
            : { ...styles.suggestionTextStyle }

        let isDisabled = false
        let opacity = 1
        if (text === 'Event') {
            isDisabled = true
            opacity = 0.5
        }

        return (
            <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onPress(key)}
                key={Math.random().toString(36).substr(2, 9)}
                style={{
                    marginTop: 15,
                    marginLeft: 30,
                    alignItems: 'flex-start',
                    opacity,
                }}
                disabled={isDisabled}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image source={iconSource} style={style} />
                    <Text style={textStyle}>{text}</Text>
                </View>
            </TouchableOpacity>
        )
    })

    return <View style={{ flex: 1 }}>{options}</View>
}

/**
 * If suggest for need or step, show a summary of
 * Step 3: Find a reading buddy
 */
const SuggestedItem = (props) => {
    const { goal, type, suggestionForRef, stepRef, needRef } = props
    let refToSearchFor = suggestionForRef

    let items = []
    if (type === 'Step' || stepRef) {
        items = _.get(goal, 'steps')

        // Use stepRef if suggestionForRef is undefined
        // This could be due to entering suggestion modal through goal card or
        // NotificationNeedCard directly through suggestion button
        if (suggestionForRef === undefined && stepRef !== undefined) {
            refToSearchFor = stepRef
        }
    }
    if (type === 'Need' || needRef) {
        items = _.get(goal, 'needs')

        // Use needRef if suggestionForRef is undefined
        // This could be due to entering suggestion modal through goal card or
        // NotificationNeedCard directly through suggestion button
        if (suggestionForRef === undefined && needRef !== undefined) {
            refToSearchFor = needRef
        }
    }

    if (!items || _.isEmpty(items)) return null
    const index = items.findIndex((temp) => temp._id === refToSearchFor)

    if (index === -1) return null
    const item = items.find((temp) => temp._id === refToSearchFor)

    const orderText = type === 'Need' || needRef ? '' : ` ${item.order}`
    const typeText = type === 'Need' || needRef ? 'Need' : 'Step'
    return (
        <View
            style={{
                flexDirection: 'row',
                margin: 15,
                marginBottom: 5,
                borderBottomColor: 'lightgray',
                borderBottomWidth: 0.5,
                paddingBottom: 10,
            }}
        >
            <Text
                style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    color: 'black',
                    fontSize: 13,
                }}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {`${typeText}${orderText}: ${item.description}`}
            </Text>
        </View>
    )
}

const mapStateToProps = (state, props) => {
    const { goalDetail } = state
    const title = goalDetail.goal.goal?.title
    const name = goalDetail.goal.goal?.owner?.name
    const newComment = getNewCommentByTab(state, props.pageId)

    return {
        newComment,
        title,
        name,
    }
}

export default connect(mapStateToProps, {
    updateSuggestionType,
    refreshPreloadData,
    cancelSuggestion,
})(SuggestionModal)
