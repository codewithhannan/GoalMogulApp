/** @format */

// This component is a search overlay for three tabs, people, event and tribe
import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { SearchBar, Icon } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import _ from 'lodash'
import { TabView, SceneMap } from 'react-native-tab-view'

// Component
import BaseOverlay from './BaseOverlay'
// import SearchFilterBar from './SearchFilterBar';
import TabButtonGroup from '../Common/TabButtonGroup'
import PeopleSearch from './People/PeopleSearch'
import EventSearch from './Event/EventSearch'
import TribeSearch from './Tribe/TribeSearch'
import ChatSearch from './Chat/ChatSearch'
import { SearchIcon } from '../../Utils/Icons'

// Actions
import {
    handleSearch,
    searchSwitchTab,
    clearSearchState,
} from '../../redux/modules/search/SearchActions'

// Styles
import { color, default_style } from '../../styles/basic'

// Constants
import {
    track,
    EVENT as E,
    SCREENS,
    wrapAnalytics,
} from '../../monitoring/segment'
import { HEADER_STYLES } from '../../styles/Header'

const DEBUG_KEY = '[ Component Search ]'

class SearchOverlay extends Component {
    constructor(props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOnEndSubmitting = this.handleOnEndSubmitting.bind(this)
        this.isCanceled = false
        this.state = {
            // We keep a local copy since debounced search takes a while to fire event to update reducer
            searchContent: undefined,
            tabTransition: false,
        }
    }

    componentWillMount() {
        track(E.SEARCH_OPENED)
    }

    componentWillUnmount() {
        track(E.SEARCH_CLOSED)
    }

    // Search bar functions
    handleCancel = () => {
        //TODO: potentially clear search state
        console.log(`${DEBUG_KEY} handle cancel`)
        this.isCanceled = true
        this.props.clearSearchState()
        // Actions.pop();
        this.refs.baseOverlay.closeModal()
    }

    handleChangeText = (value) => {
        if (value === undefined) {
            return
        }
        this.setState(
            {
                ...this.state,
                searchContent: value,
            },
            () => {
                if (value === '') {
                    this.props.clearSearchState(this.props.selectedTab)
                }
                this.props.debouncedSearch(value.trim(), this.props.selectedTab)
            }
        )
    }

    handleOnEndSubmitting = ({ nativeEvent }) => {
        const { text, eventCount, taget } = nativeEvent
        // Close the search modal if nothing is entered
        console.log('on end editing')
        if (
            (text === undefined ||
                text === null ||
                text === '' ||
                text.trim() === '') &&
            !this.state.tabTransition &&
            !this.isCanceled
        ) {
            this.handleCancel()
        }
    }

    // Tabs handler functions
    _handleIndexChange = (index) => {
        console.log(`${DEBUG_KEY}: index changed to ${index}`)
        this.setState({
            ...this.state,
            tabTransition: true,
        })
        this.props.searchSwitchTab(index)

        // This is a workaround for cancel button disappear when losing focus
        // We don't want to trigger onSubmitEnding with handleCancel when
        // changing the tab
        setTimeout(() => {
            this.setState({
                ...this.state,
                tabTransition: false,
            })
            this.search.focus()
        }, 200)
    }

    _renderHeader = (props) => {
        return <TabButtonGroup buttons={props} />
    }

    _renderScene = SceneMap({
        people: () => <PeopleSearch type="GeneralSearch" />,
        tribes: () => <TribeSearch type="GeneralSearch" />,
        events: () => <EventSearch type="GeneralSearch" />,
        chatRooms: () => <ChatSearch type="GeneralSearch" />,
    })

    render() {
        return (
            <BaseOverlay
                verticalPercent={1}
                horizontalPercent={1}
                ref="baseOverlay"
            >
                <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                    <View style={HEADER_STYLES.headerContainer}>
                        <SearchBar
                            ref={(search) => (this.search = search)}
                            platform="ios"
                            round
                            autoFocus
                            inputStyle={styles.searchInputStyle}
                            inputContainerStyle={
                                styles.searchInputContainerStyle
                            }
                            containerStyle={{
                                height:
                                    HEADER_STYLES.headerContainer.height -
                                    HEADER_STYLES.headerContainer.paddingTop,
                                backgroundColor: color.GM_BLUE,
                            }}
                            placeholder="Search GoalMogul"
                            cancelButtonTitle="Cancel"
                            onCancel={this.handleCancel}
                            onChangeText={this.handleChangeText}
                            clearIcon={null}
                            showLoading={this.props.loading}
                            placeholderTextColor={color.GM_BLUE}
                            cancelButtonProps={{
                                buttonTextStyle: {
                                    color: 'white',
                                },
                            }}
                            searchIcon={() => (
                                <SearchIcon
                                    iconContainerStyle={{
                                        marginVertical: 1,
                                    }}
                                    iconStyle={{
                                        tintColor: color.GM_BLUE,
                                        height: 15,
                                        width: 15,
                                    }}
                                />
                            )}
                            onEndEditing={this.handleOnEndSubmitting}
                            value={this.state.searchContent}
                        />
                    </View>
                    <TabView
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderHeader}
                        onIndexChange={this._handleIndexChange}
                        useNativeDriver
                        swipeEnabled={false}
                    />
                </MenuProvider>
            </BaseOverlay>
        )
    }
}

const styles = {
    searchInputContainerStyle: {
        height: 20,
        backgroundColor: color.GM_BLUE_LIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    searchInputStyle: default_style.normalText_1,
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
}

const mapStateToProps = (state) => {
    const { selectedTab, navigationState, searchContent } = state.search
    const { loading } = state.search[selectedTab]

    return {
        selectedTab,
        navigationState,
        loading,
        searchContent,
    }
}

const mapDispatchToProps = (dispatch) => {
    const debouncedSearch = _.debounce(
        (value, type) => dispatch(handleSearch(value, type)),
        400
    )
    return {
        debouncedSearch,
        // searchSwitchTab: searchSwitchTab(dispatch),
        searchSwitchTab: (index) => dispatch(searchSwitchTab(index)),
        clearSearchState: clearSearchState(dispatch),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(wrapAnalytics(SearchOverlay, SCREENS.SEARCH_OVERLAY))
