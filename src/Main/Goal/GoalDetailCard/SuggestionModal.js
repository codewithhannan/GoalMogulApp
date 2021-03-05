/** @format */

import React, { Component } from 'react'
import {
    View,
    Modal,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader'
import SearchSuggestion from './Suggestion/SearchSuggestion'
import GeneralSuggestion from './Suggestion/GeneralSuggestion'

// Asset
import Book from '../../../asset/suggestion/book.png'
import Chat from '../../../asset/suggestion/chat.png'
import Event from '../../../asset/suggestion/event.png'
import Flag from '../../../asset/suggestion/flag.png'
import Friend from '../../../asset/suggestion/friend.png'
import Group from '../../../asset/suggestion/group.png'
import Link from '../../../asset/suggestion/link.png'
import Other from '../../../asset/suggestion/other.png'
import HelpIcon from '../../../asset/utils/help.png'
import StepIcon from '../../../asset/utils/steps.png'

// Actions
import { updateSuggestionType } from '../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../redux/modules/feed/comment/CommentSelector'

class SuggestionModal extends Component {
    state = {
        query: '',
    }

    renderIconItem = ({ item }) => {
        const { selected } = item

        // Update Icon style if selected
        const style = selected
            ? {
                  ...styles.selectedSuggestionIconStyle,
                  ...item.value.iconStyle,
              }
            : {
                  ...styles.suggestionIconStyle,
                  ...item.value.iconStyle,
              }

        // Update text style if selected
        const textStyle = selected
            ? { ...styles.selectedSuggestionTextStyle }
            : { ...styles.suggestionTextStyle }
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    marginBottom: 7,
                    marginLeft: 10,
                }}
            >
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() =>
                        this.props.updateSuggestionType(
                            item.key,
                            this.props.pageId
                        )
                    }
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image source={item.value.iconSource} style={style} />
                        <Text style={textStyle}>{item.text.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderOptions(newComment) {
        const { suggestionType } = newComment.tmpSuggestion
        const iconMap = updateIconMap(suggestionType, IconMap)

        const options = (
            <View style={{ padding: 10 }}>
                <FlatList
                    data={iconMap}
                    renderItem={this.renderIconItem}
                    keyExtractor={(item) => item.key}
                    numColumns={2}
                />
            </View>
        )

        return (
            <View style={{ backgroundColor: 'white', marginTop: 0.5 }}>
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: '700',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                    }}
                >
                    Suggest a...
                </Text>
                {options}
            </View>
        )
    }

    renderSuggestionBody(newComment) {
        const { suggestionType } = newComment.tmpSuggestion

        if (
            suggestionType === 'User' ||
            suggestionType === 'Friend' ||
            suggestionType === 'Event' ||
            suggestionType === 'Tribe' ||
            suggestionType === 'ChatConvoRoom'
        ) {
            return <SearchSuggestion pageId={this.props.pageId} />
        }

        return <GeneralSuggestion pageId={this.props.pageId} />
    }

    render() {
        const { newComment } = this.props
        if (!newComment) return null

        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.visible}
            >
                <ModalHeader
                    title="Suggestion"
                    actionText="Attach"
                    onCancel={this.props.onCancel}
                    onAction={() => this.props.onAttach()}
                />
                <ScrollView>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior="padding"
                    >
                        <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
                            {this.renderOptions(newComment)}
                            {this.renderSuggestionBody(newComment)}
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </Modal>
        )
    }
}

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
}
//["ChatConvoRoom", "Event", "Tribe", "Link", "Reading",
// "Step", "Need", "Friend", "User", "Custom"]
const IconMap = [
    {
        key: 'Reading',
        text: 'Reading',
        value: {
            iconSource: Book,
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
        key: 'User',
        text: 'User',
        value: {
            iconSource: Friend,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Friend',
        text: 'Friend',
        value: {
            iconSource: Group,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Step',
        text: 'Step',
        value: {
            iconSource: StepIcon,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Need',
        text: 'Need',
        value: {
            iconSource: HelpIcon,
            iconStyle: {},
        },
        selected: undefined,
    },
    {
        key: 'Link',
        text: 'Link',
        value: {
            iconSource: Link,
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

const mapStateToProps = (state, props) => {
    const newComment = getNewCommentByTab(state, props.pageId)

    return {
        newComment,
    }
}

export default connect(mapStateToProps, {
    updateSuggestionType,
})(SuggestionModal)
