/** @format */

// This is backup for original implementation for suggesiton modal
import React, { Component } from 'react'
import {
    View,
    Modal,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { connect } from 'react-redux'
import _ from 'lodash'

// Components
import ModalHeader from '../../../Main/Common/Header/ModalHeader'
import PeopleCard from '../Common/PeopleCard'
import PeopleCardDetail from '../Common/PeopleCardDetail'

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

const testData = [
    {
        name: 'Jia Zeng',
        headline: 'Students at Duke University',
        request: false,
        _id: '120937109287091',
    },
    {
        name: 'Peter Kushner',
        headline: 'CEO at start industries',
        request: false,
        _id: '019280980248303',
    },
]

class SuggestionModal extends Component {
    state = {
        query: '',
    }

    // Flatlist handler
    handleRefresh = () => {}

    handleOnLoadMore = () => {}

    // Search Query handler
    handleSearchCancel = () => this.handleQueryChange('')
    handleSearchClear = () => this.handleQueryChange('')

    handleQueryChange = (query) => {
        this.setState((state) => ({ ...state, query: query || '' }))
    }

    renderSearch() {
        return (
            <SearchBar
                platform="ios"
                round
                autoFocus={false}
                inputStyle={styles.searchInputStyle}
                inputContainerStyle={styles.searchInputContainerStyle}
                containerStyle={styles.searchContainerStyle}
                placeholder="Search by name, occupation, etc."
                cancelButtonTitle="Cancel"
                onCancel={this.handleSearchCancel}
                onChangeText={this.handleQueryChange}
                cancelButtonProps={{ color: '#17B3EC' }}
                showLoading={this.props.loading}
                onClear={this.handleSearchClear}
                value={this.state.query}
            />
        )
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

    renderOptions() {
        const options = (
            <View style={{ padding: 10 }}>
                <FlatList
                    data={this.props.iconMap}
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

    renderItem = ({ item }) => (
        <PeopleCard>
            <PeopleCardDetail item={item} />
        </PeopleCard>
    )

    renderQueryResult() {
        return (
            <View style={{ flex: 1, marginTop: 0.5, backgroundColor: 'white' }}>
                <FlatList
                    data={testData}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item._id}
                    onEndReached={this.handleOnLoadMore}
                    onEndReachedThreshold={0}
                />
            </View>
        )
        // onRefresh={this.handleRefresh}
        // refreshing={this.props.refreshing}
        // ListEmptyComponent={<EmptyResult text={'You haven\'t added any friends'} />}
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.props.visible}
            >
                <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
                    <ModalHeader
                        title="Suggestion"
                        actionText="Attach"
                        onCancel={this.props.onCancel}
                        onAction={() => this.props.onAttach()}
                    />
                    {this.renderOptions()}
                    {this.renderSearch()}
                    {this.renderQueryResult()}
                </View>
            </Modal>
        )
    }
}

const styles = {
    searchContainerStyle: {
        padding: 0,
        marginRight: 3,
        marginTop: 0.5,
        backgroundColor: '#ffffff',
        // backgroundColor: '#17B3EC',
        borderTopColor: '#ffffff',
        borderBottomColor: '#ffffff',
        alignItems: 'center',
    },
    searchInputContainerStyle: {
        backgroundColor: '#f3f4f6',
        // backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchInputStyle: {
        fontSize: 15,
    },
    searchIconStyle: {
        top: 15,
        fontSize: 13,
    },
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
    const { tmpSuggestion } = getNewCommentByTab(state, props.pageId)
    const { suggestionType } = tmpSuggestion
    const iconMap = updateIconMap(suggestionType, IconMap)

    return {
        tmpSuggestion,
        iconMap,
    }
}

export default connect(mapStateToProps, {
    updateSuggestionType,
})(SuggestionModal)
