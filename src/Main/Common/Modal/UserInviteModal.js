/**
 * This is a multi select user invite modal. User can select multiple users with search
 * and at the next step, it will send out invite for an entity to all selected users.
 *
 * Current supported entities: ['Tribe', 'Event']
 * To integrate: ['Chat']
 *
 * @format
 */

import PropTypes from 'prop-types'
import React from 'react'
import {
    ViewPropTypes,
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    Alert,
    Image,
    FlatList,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import _ from 'lodash'
import ModalHeader from '../Header/ModalHeader'
import { SearchBar } from 'react-native-elements'
import { Actions } from 'react-native-router-flux'
import { SearchIcon } from '../../../Utils/Icons'
import SearchUserCard from '../../Search/People/SearchUserCard'
import plus from '../../../asset/utils/plus.png'
import times from '../../../asset/utils/times.png'
import { arrayUnique } from '../../../redux/middleware/utils'

const AUTO_SEARCH_DELAY_MS = 500
const DEBUG_KEY = '[ UI UserInviteModal ]'
const DEFAULT_LIMIT = 10

class UserInviteModal extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedItems: [], // Items selected. In this modal, it's user.
            searchRes: [], // Search result
            searchQuery: '', // Search query
            loading: false, // Searching state
            hasNextPage: undefined, // If there is next page for the current search res
            preloadHasNextPage: undefined, // Preload data has next page
            preloadData: [], // Preload data
        }
    }

    componentDidMount() {
        // Preload data
        this.preload()
    }

    // Update search result callback
    updateSearchRes = (res, hasNextPage) => {
        this.setState({
            ...this.state,
            searchRes: res,
            hasNextPage,
            loading: false,
        })
    }

    updatePreloadRes = (res, hasNextPage) => {
        if (!res.length) {
            this.setState({
                ...this.state,
                preloadHasNextPage: false,
                loading: false,
            })
            return
        }

        const oldData = _.cloneDeep(this.state.preloadData)
        const newData = arrayUnique(oldData.concat(res))
        this.setState({
            ...this.state,
            preloadData: newData,
            preloadHasNextPage: hasNextPage,
            loading: false,
        })
    }

    preload = () => {
        // Do not preload if no next page or no preload func defined
        if (
            this.state.preloadHasNextPage === false ||
            !this.props.preload ||
            this.props.loading
        )
            return

        this.setState(
            {
                ...this.state,
                loading: true,
            },
            () => {
                this.props.preload(
                    this.state.preloadData, // current preload result
                    DEFAULT_LIMIT, // response limit
                    this.updatePreloadRes // call back to update component state related to preload
                )
            }
        )
    }

    _keyExtractor = (item) => item._id

    // Handle change search text to fetch search result
    handleChangeSearchText = (searchText) => {
        clearTimeout(this.searchTimeout)
        if (!searchText.trim().length) {
            this.setState({
                ...this.state,
                searchRes: [], // Clear search res since query is empty
                searchQuery: searchText,
                loading: false,
                hasNextPage: undefined,
            })
            return
        }

        this.searchTimeout = setTimeout(
            () =>
                this.props.searchFor(
                    searchText, // new search text
                    [], // current search res, empty as this is a new search
                    5, // limit
                    this.updateSearchRes // callback to update the state
                ),
            AUTO_SEARCH_DELAY_MS
        )

        this.setState({
            ...this.state,
            searchQuery: searchText,
            hasNextPage: undefined,
            loading: true,
        })
    }

    onSearchResultSelect = (itemId, itemDoc) => {
        let newSelectedItems = _.map(this.state.selectedItems, _.clone)
        if (itemDoc.isSearchResult) {
            let newItemDoc = _.cloneDeep(itemDoc)
            newItemDoc = _.set(newItemDoc, 'isSearchResult', false)
            newSelectedItems.push(newItemDoc)
            this.search.clear()
            this.search.focus()
            itemDoc.isSearchResult = false

            // Reset states
            this.setState({
                ...this.state,
                selectedItems: arrayUnique(newSelectedItems),
                searchRes: [],
                searchQuery: '',
                loading: false,
            })
        } else {
            const indexToRemove = newSelectedItems.findIndex(
                (itemDoc) => itemDoc._id == itemId
            )
            if (indexToRemove > -1) {
                newSelectedItems.splice(indexToRemove, 1)
            } else {
                return
            }
            this.setState({
                ...this.state,
                selectedItems: newSelectedItems,
            })
            itemDoc.isSearchResult = true
        }
    }

    handleSubmit = () => {
        if (this.props.submitting) return

        if (!this.state.selectedItems.length) {
            return Alert.alert('Select an User to continue')
        }

        const actionToExecute = () => Actions.pop()
        if (this.props.onSubmitSelection) {
            this.props.onSubmitSelection(
                this.state.selectedItems,
                this.props.inviteToEntity,
                actionToExecute
            )
            return
        }

        console.warn(
            `${DEBUG_KEY}: no action supplied for submission. Simply closing the modal`
        )
        actionToExecute()
    }

    handleClose = () => {
        const actionToExecute = () => Actions.pop()
        if (this.props.onCloseCallback) {
            // Pass closing modal action to onCloseCallback
            this.props.onCloseCallback(actionToExecute)
            return
        }
        actionToExecute()
    }

    // Load more search result which should set the loading to true
    handleLoadMore = () => {
        if (
            this.props.searchFor &&
            this.state.hasNextPage !== false &&
            this.state.searchQuery.length &&
            !this.state.loading
        ) {
            this.setState({
                ...this.state,
                loading: true,
            })
            this.props.searchFor(
                this.state.searchQuery, // new search text
                this.state.searchRes, // current search res
                5, // limit
                this.updateSearchRes // callback to update the state
            )
            return
        }

        const hasInput = this.state.searchQuery.length > 0
        const searchHasNoNextPage = hasInput && this.state.hasNextPage === false

        if (!hasInput || searchHasNoNextPage) {
            this.preload()
        }
    }

    renderListFooter = () => {
        if (!this.state.loading) return null
        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: '#CED0CE',
                }}
            >
                <ActivityIndicator animating size="small" />
            </View>
        )
    }

    renderListEmptyState = () => {
        if (this.state.loading) return null

        const searchPlaceHolder = 'Search friends...'
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 100,
                }}
            >
                <Text
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: 18,
                        color: '#999',
                    }}
                >
                    {this.state.searchQuery.trim().length
                        ? ''
                        : searchPlaceHolder}
                </Text>
            </View>
        )
    }

    renderListItem = ({ item }) => {
        return (
            <SearchUserCard
                item={item}
                onSelect={this.onSearchResultSelect}
                itemIsSelected={item.isSearchResult ? true : false}
                cardIconSource={item.isSearchResult ? plus : times}
                cardContainerStyles={
                    item.isSearchResult ? {} : { backgroundColor: '#D8EDFF' }
                }
            />
        )
    }

    render() {
        const searchPlaceHolder = 'Search friends'
        const modalDescriptionAction = getActionType(
            this.props.inviteToEntityType
        )

        let dataToUse = this.state.searchQuery.trim().length
            ? this.state.searchRes
            : this.state.preloadData

        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{
                        ...styles.homeContainerStyle,
                        flex: 1,
                        backgroundColor: '#ffffff',
                    }}
                >
                    <ModalHeader
                        title={`Add Members`}
                        actionText={'Invite'}
                        onCancel={this.handleClose}
                        onAction={this.handleSubmit}
                    />
                    <ScrollView
                        style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
                    >
                        <SearchBar
                            ref={(search) => (this.search = search)}
                            platform="default"
                            clearIcon={null}
                            containerStyle={{
                                backgroundColor: 'transparent',
                                padding: 6,
                                borderColor: 'white',
                                borderWidth: 0,
                            }}
                            inputContainerStyle={{
                                backgroundColor: '#FAFAFA',
                            }}
                            inputStyle={{
                                fontSize: 15,
                            }}
                            placeholder={searchPlaceHolder}
                            onChangeText={this.handleChangeSearchText.bind(
                                this
                            )}
                            searchIcon={
                                <SearchIcon
                                    iconContainerStyle={{
                                        marginBottom: 3,
                                        marginTop: 1,
                                    }}
                                    iconStyle={{
                                        tintColor: '#777',
                                        height: 15,
                                        width: 15,
                                    }}
                                />
                            }
                            value={this.state.searchQuery}
                            lightTheme={true}
                        />
                        <FlatList
                            data={this.state.selectedItems}
                            renderItem={this.renderListItem}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                        />
                        {/* Search result items */}
                        <FlatList
                            data={dataToUse.map((doc) => {
                                doc.isSearchResult = true
                                return doc
                            })}
                            renderItem={this.renderListItem}
                            numColumns={1}
                            keyExtractor={this._keyExtractor}
                            refreshing={this.state.loading}
                            ListFooterComponent={this.renderListFooter}
                            ListEmptyComponent={this.renderListEmptyState}
                            onEndThreshold={0}
                            onEndReached={this.handleLoadMore}
                        />
                    </ScrollView>
                </KeyboardAvoidingView>
            </MenuProvider>
        )
    }
}

const getActionType = (entityType) => {
    if (entityType === 'Event') {
        return 'attend'
    }
    if (entityType === 'Tribe') {
        return 'join'
    }
    return ''
}

const styles = {
    cardContainerStyle: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        marginTop: 1,
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
}

// Attempts to add prop types
UserInviteModal.defaultProps = {
    onCloseCallback: (actionToExecute) => actionToExecute(),
}

UserInviteModal.propTypes = {
    // containerStyle: ViewPropTypes.style, Example for view style prop style

    // Optional props
    onCloseCallback: PropTypes.func, // Function when close is clicked
    // Preload related
    preload: PropTypes.func, // Function to prelaod data

    // Required props
    searchFor: PropTypes.func.isRequired, // Function to load search result
    onSubmitSelection: PropTypes.func.isRequired, // On submit click when selection is done

    inviteToEntityType: PropTypes.string.isRequired, // Entity type to invite to
    inviteToEntity: PropTypes.string.isRequired, // Entity id to invite to
    inviteToEntityName: PropTypes.string.isRequired, // Entity name to invite to
}

export default UserInviteModal
