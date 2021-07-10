/**
 * This page provides the general components when user wants to invite user(s)
 * to a Tribe / Chat room.
 *
 * This is a UI rework for the similar component {@link UserInviteModal}
 *
 * @format
 */

import { Icon, Input, Layout, withStyles } from '@ui-kitten/components'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Text,
    View,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import defaultProfilePic from '../../asset/utils/defaultUserProfile.png'
import {
    arrayUnique,
    getProfileImageOrDefaultFromUser,
} from '../../redux/middleware/utils'
import InviteUserCard from '../Search/People/InviteUserCard'
import DelayedButton from './Button/DelayedButton'
import ModalHeader from './Header/ModalHeader'
import ProfileImage from './ProfileImage'

const AUTO_SEARCH_DELAY_MS = 800
const DEBUG_KEY = '[ UI MultiUserInvitePage ]'
const DEFAULT_LIMIT = 10

class MultiUserInvitePage extends React.PureComponent {
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
        // TODO: preload friends if less than 10 friends are loaded
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
            this.state.loading
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
        let newSelectedItems = _.cloneDeep(this.state.selectedItems)
        let newItemDoc = _.cloneDeep(itemDoc)

        if (!itemDoc['selected']) {
            this.search.clear()
            // Item was not selected and now is selected. Thus adding to the selected list
            newSelectedItems = newSelectedItems.concat(
                _.set(newItemDoc, 'selected', true)
            )

            // change the state of the item to selected. Since we did array unique,
            // it's fine to do the same operation in both array but just less efficient
            const newPreloadData = this.state.preloadData.map((d) => {
                if (d._id == itemId) {
                    return _.set(d, 'selected', true)
                }
                return _.cloneDeep(d)
            })

            const newSearchRes = this.state.searchRes.map((d) => {
                if (d._id == itemId) {
                    return _.set(d, 'selected', true)
                }
                return _.cloneDeep(d)
            })

            // Reset states
            this.setState({
                ...this.state,
                searchQuery: '',
                loading: false,
                selectedItems: arrayUnique(newSelectedItems),
                preloadData: newPreloadData,
                searchRes: newSearchRes,
            })
        } else {
            // Item was previously selected
            newSelectedItems = newSelectedItems.filter((i) => i._id !== itemId)

            // change the state of the item to selected. Since we did array unique,
            // it's fine to do the same operation in both array but just less efficient
            const newPreloadData = this.state.preloadData.map((d) => {
                if (d._id == itemId) {
                    return _.set(d, 'selected', false)
                }
                return _.cloneDeep(d)
            })

            const newSearchRes = this.state.searchRes.map((d) => {
                if (d._id == itemId) {
                    return _.set(d, 'selected', false)
                }
                return _.cloneDeep(d)
            })

            // Reset states
            this.setState({
                ...this.state,
                selectedItems: arrayUnique(newSelectedItems),
                preloadData: newPreloadData,
                searchRes: newSearchRes,
            })
        }

        this.props.onSelectionChange(arrayUnique(newSelectedItems))
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

    renderSearchBar = () => {
        const searchPlaceHolder = 'Search friends'
        return (
            <Layout
                style={{
                    padding: 16,
                    backgroundColor: 'white',
                    marginBottom: 8,
                }}
            >
                <Input
                    style={{ backgroundColor: 'white' }}
                    accessoryLeft={(props) => (
                        <Icon name="search" pack="material" {...props} />
                    )}
                    value={this.state.searchQuery}
                    ref={(search) => (this.search = search)}
                    placeholder={searchPlaceHolder}
                    onChangeText={this.handleChangeSearchText}
                />
                <FlatList
                    data={this.state.selectedItems}
                    renderItem={this.renderSelectedItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    horizontal
                />
            </Layout>
        )
    }

    /**
     * Render seleted item
     */
    renderSelectedItem = ({ item }) => {
        const { profile, _id } = item

        return (
            <Layout style={{ marginRight: 10, marginTop: 10 }}>
                <DelayedButton
                    style={styles.imageContainerStyle}
                    onPress={() => this.onSearchResultSelect(_id, item)}
                >
                    <Layout
                        style={{
                            position: 'absolute',
                            right: -2,
                            top: -2,
                            backgroundColor: 'transparent',
                        }}
                        zIndex={2}
                    >
                        <View
                            style={{
                                height: 15,
                                width: 15,
                                borderRadius: 7.5,
                                backgroundColor: 'white',
                            }}
                        >
                            <Icon
                                name="cancel"
                                pack="material"
                                style={{ height: 15, width: 15 }}
                            />
                        </View>
                    </Layout>
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(item)}
                        imageContainerStyle={styles.imageStyle}
                        imageStyle={styles.imageStyle}
                    />
                </DelayedButton>
            </Layout>
        )
    }

    /**
     * NOTE: TODO: tags should be coming from API in item rather than from the props.
     * Refactor this function once https://app.asana.com/0/1179217829906634/1183132912958225/f
     * is completed
     */
    renderListItem = ({ item }) => {
        return (
            <InviteUserCard
                item={item}
                onSelect={this.onSearchResultSelect}
                tags={this.props.tags}
            />
        )
    }

    render() {
        const { eva } = this.props

        let dataToUse = this.state.searchQuery.trim().length
            ? this.state.searchRes
            : this.state.preloadData

        return (
            <Layout style={[eva.style.container]}>
                {this.props.noHeader ? null : (
                    <ModalHeader
                        title={`Friends`}
                        actionText={'Add'}
                        onCancel={this.handleClose}
                        onAction={this.handleSubmit}
                    />
                )}

                {/* Search result items */}
                <FlatList
                    // Somehow we need this map but I don't know why
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
                    ListHeaderComponent={this.renderSearchBar}
                    onEndThreshold={0}
                    onEndReached={this.handleLoadMore}
                />
            </Layout>
        )
    }
}

const styles = {
    imageStyle: {
        height: 34,
        width: 34,
        borderRadius: 17,
    },
    defaultImageStyle: {
        height: 26,
        width: 26,
        borderRadius: 13,
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
}

// Attempts to add prop types
MultiUserInvitePage.defaultProps = {
    onCloseCallback: (actionToExecute) => actionToExecute(),
    noHeader: false,
    onSelectionChange: (data) => {},
    tags: {
        invited: [],
        requested: [],
        admin: [],
        member: [],
    },
}

MultiUserInvitePage.propTypes = {
    // containerStyle: ViewPropTypes.style, Example for view style prop style

    // Optional props
    onCloseCallback: PropTypes.func, // Function when close is clicked
    noHeader: PropTypes.bool,
    onSelectionChange: PropTypes.func, // Function that directly obtains the result of the selected data.
    // Preload related
    preload: PropTypes.func, // Function to prelaod data

    /**
     * TODO: tags should be coming from API in item rather than from the props.
     * Refactor this function once https://app.asana.com/0/1179217829906634/1183132912958225/f
     * is completed
     */
    tags: PropTypes.shape({
        invited: PropTypes.arrayOf(PropTypes.string), // user already invited
        requested: PropTypes.arrayOf(PropTypes.string), // user already requested
        member: PropTypes.arrayOf(PropTypes.string), // user already in the entity
        admin: PropTypes.arrayOf(PropTypes.string), // user is an admin of the entity
    }),

    // Required props
    searchFor: PropTypes.func.isRequired, // Function to load search result
    onSubmitSelection: PropTypes.func.isRequired, // On submit click when selection is done

    inviteToEntityType: PropTypes.string.isRequired, // Entity type to invite to
    inviteToEntity: PropTypes.string.isRequired, // Entity id to invite to
    inviteToEntityName: PropTypes.string.isRequired, // Entity name to invite to
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.style.container;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 *
 * Later on this function should be migrated to a centralized place
 */
const mapThemeToStyles = (theme) => ({
    backgroundPrimary: {
        backgroundColor: theme['color-primary-500'],
    },
    container: {
        backgroundColor: theme['color-card-background'],
        flex: 1,
    },
})

const mapStateToProps = (state) => {
    return {}
}

const StyledMultiUserInvitePage = withStyles(
    MultiUserInvitePage,
    mapThemeToStyles
)
export default StyledMultiUserInvitePage
