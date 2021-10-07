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
    Modal,
    Text,
    Image,
    TouchableOpacity,
    Animated,
    Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader'
import SearchSuggestion from './Suggestion/SearchSuggestion'
import GeneralSuggestion from './Suggestion/GeneralSuggestion'
import NeedStepSuggestion from './Suggestion/NeedStepSuggestion'
import SuggestionGoalPreview from './Suggestion/SuggestionGoalPreview'

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

// Actions
import { updateSuggestionType } from '../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'

import { refreshPreloadData } from '../../../redux/modules/feed/comment/SuggestionSearchActions'

// Utils function
import { switchCase } from '../../../redux/middleware/utils'
import { Logger } from '../../../redux/middleware/utils/Logger'

const DEBUG_KEY = '[ UI SuggestionModal3 ]'
const OPTIONS_HEIGHT = 120
const OPTIONS_OPACITY = 0.001

class SuggestionModal extends Component {
    constructor(props) {
        super(props)
        this.fadeHeight = new Animated.Value(OPTIONS_HEIGHT)
        this.fadeOpacity = new Animated.Value(1)
        this.suggestionOpacity = new Animated.Value(0.001)
        this.state = {
            query: '',
            iconMapRight: [...IconMapRight],
            iconMapLeft: [...IconMapLeft],
            optionsCollapsed: false,
            optionsHeight: 150,
        }
    }

    componentDidMount() {
        // Sending request to fetch pre-populated data
        Logger.log(`${DEBUG_KEY}: [ componentDidMount ]`, {}, 2)
        this.props.refreshPreloadData('User')
        this.props.refreshPreloadData('Event')
        this.props.refreshPreloadData('Tribe')
        this.props.refreshPreloadData('ChatConvoRoom')
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
            iconMapRight: [...IconMapRight],
            iconMapLeft: [...IconMapLeft],
        })
    }

    // Update icon map with selected options
    updateIconMap = (suggestionType) => {
        this.props.updateSuggestionType(suggestionType, this.props.pageId)
        const { iconMapRight, iconMapLeft } = this.state
        const newIconMapRight = updateIconMap(suggestionType, iconMapRight)
        const newIconMapLeft = updateIconMap(suggestionType, iconMapLeft)

        this.setState({
            ...this.state,
            iconMapRight: newIconMapRight,
            iconMapLeft: newIconMapLeft,
        })
        this.handleCollapse()
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
        const { iconMapRight, iconMapLeft, optionsCollapsed } = this.state

        const optionsRight = (
            <Options iconMap={iconMapRight} onPress={this.updateIconMap} />
        )

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
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '500',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                        >
                            Suggest {suggestionForText}
                        </Text>
                    </View>
                    {optionsCollapsed ? <View style={{ width: 50 }} /> : null}
                </View>

                <Animated.View
                    style={{
                        flexDirection: 'row',
                        height: this.fadeHeight,
                        opacity: this.fadeOpacity,
                    }}
                >
                    {optionsLeft}
                    {optionsRight}
                </Animated.View>
            </View>
        )
    }

    renderSuggestionBody(newComment) {
        const { suggestionType } = newComment.tmpSuggestion
        if (!this.state.optionsCollapsed) return null
        if (
            suggestionType === 'User' ||
            suggestionType === 'Friend' ||
            suggestionType === 'Event' ||
            suggestionType === 'Tribe' ||
            suggestionType === 'ChatConvoRoom'
        ) {
            return (
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
            )
        }
        if (suggestionType === 'NewNeed' || suggestionType === 'NewStep') {
            return (
                <NeedStepSuggestion
                    pageId={this.props.pageId}
                    opacity={this.suggestionOpacity}
                />
            )
        }
        if (suggestionType === 'Custom') {
            return (
                <GeneralSuggestion
                    pageId={this.props.pageId}
                    opacity={this.suggestionOpacity}
                />
            )
        }
        return null
    }

    render() {
        const { newComment, item } = this.props
        if (!newComment || !item) return null

        return (
            <View style={{ height: 30 }}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.props.visible}
                    onDismiss={this.resetIconMap}
                >
                    <ModalHeader
                        title="Suggestion"
                        actionText="Attach"
                        onCancel={this.props.onCancel}
                        onAction={() => this.props.onAttach()}
                    />
                    <KeyboardAwareScrollView
                        innerRef={(ref) => {
                            this.scrollview = ref
                        }}
                        style={styles.scroll}
                        extraScrollHeight={13}
                        contentContainerStyle={{
                            backgroundColor: 'white',
                            // flexGrow: 1, // this will fix scrollview scroll issue by passing parent view width and height to it
                        }}
                        onKeyboardWillShow={() => {
                            this.scrollview.props.scrollToPosition(0, 120)
                        }}
                        onKeyboardWillHide={() => {
                            this.scrollview.props.scrollToPosition(0, 0)
                        }}
                    >
                        <View style={{}}>
                            {/* {this.renderGoalPreview(item)} */}
                            {this.renderSuggestionFor(newComment, item)}
                            {this.renderOptions(newComment)}
                            {this.renderSuggestionBody(newComment)}
                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            </View>
        )
    }
}

// Legacy usage of KeyboardAvoidingView
// <ScrollView>
//   <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>

const styles = {
    // Options style
    selectedSuggestionIconStyle: {
        tintColor: '#17B3EC',
        height: 20,
        width: 20,
    },
    suggestionIconStyle: {
        tintColor: '#b8c7cb',
        height: 20,
        width: 20,
    },
    selectedSuggestionTextStyle: {
        color: 'black',
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 15,
    },
    suggestionTextStyle: {
        color: '#b8c7cb',
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
        backgroundColor: 'white',
        marginTop: 0.5,
        marginLeft: 15,
        marginRight: 15,
        borderBottomColor: 'lightgray',
        borderBottomWidth: 0.5,
        paddingBottom: 5,
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
            iconSource: Friend,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'ChatConvoRoom',
        text: 'Chatroom',
        value: {
            iconSource: Chat,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'NewNeed',
        text: 'Step or Need',
        value: {
            iconSource: StepIcon,
            iconStyle: {},
        },
        selected: undefined,
    },
]

const IconMapRight = [
    {
        key: 'Event',
        text: 'Event',
        value: {
            iconSource: Event,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Tribe',
        text: 'Tribe',
        value: {
            iconSource: Flag,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Custom',
        text: 'Custom',
        value: {
            iconSource: Other,
            iconStyle: {},
        },
        selected: undefined,
    },
]

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
                    <Text style={textStyle}>{text.toUpperCase()}</Text>
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
    const newComment = getNewCommentByTab(state, props.pageId)

    return {
        newComment,
    }
}

export default connect(mapStateToProps, {
    updateSuggestionType,
    refreshPreloadData,
})(SuggestionModal)
