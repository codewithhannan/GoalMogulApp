/** @format */

// This component is used for search for only tribe
// This component is a search overlay for three tabs, people, tribe and tribe
import React, { Component } from 'react'
import { View, Platform, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import { MenuProvider } from 'react-native-popup-menu'
import _ from 'lodash'

// Component
import BaseOverlay from './BaseOverlay'
import TribeSearch from './Tribe/TribeSearch'
import { SearchIcon } from '../../Utils/Icons'

// Actions
import {
    handleSearch,
    clearSearchState,
} from '../../redux/modules/search/SearchActions'

// Constants
import { IPHONE_MODELS, DEVICE_MODEL } from '../../Utils/Constants'

const DEBUG_KEY = '[ Tribe Search ]'
const SEARCH_TYPE = 'myTribes'

class TribeSearchOverlay extends Component {
    constructor(props) {
        super(props)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleOnEndSubmitting = this.handleOnEndSubmitting.bind(this)
        this.state = {
            searchContent: undefined,
        }
    }

    handleOnEndSubmitting = ({ nativeEvent }) => {
        const { text, eventCount, taget } = nativeEvent
        // Close the search modal if nothing is entered
        if (
            text === undefined ||
            text === null ||
            text === '' ||
            text.trim() === ''
        ) {
            this.handleCancel()
        }
    }

    // Search bar functions
    handleCancel = () => {
        //TODO: potentially clear search state
        console.log(`${DEBUG_KEY} handle cancel`)
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
                    this.props.clearSearchState(SEARCH_TYPE)
                }
                this.props.debouncedSearch(value.trim(), SEARCH_TYPE)
            }
        )
    }

    // searchIcon = () => (
    //   <View style={{ flexDirection: 'row' }}>
    //     <Icon
    //       type='font-awesome'
    //       name='search'
    //       style={styles.searchIconStyle}
    //     />
    //     <Text>Search GoalMogul</Text>
    //   </View>
    // );

    render() {
        const searchPlaceHolder = this.props.searchPlaceHolder
            ? this.props.searchPlaceHolder
            : 'Search a tribe'

        const marginTop =
            Platform.OS === 'ios' && IPHONE_MODELS.includes(DEVICE_MODEL)
                ? 20
                : 30

        return (
            <BaseOverlay
                verticalPercent={1}
                horizontalPercent={1}
                ref="baseOverlay"
            >
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <KeyboardAvoidingView
                        behavior="padding"
                        style={{ flex: 1 }}
                        enabled
                    >
                        <View
                            style={{
                                ...styles.headerContainerStyle,
                                marginTop,
                            }}
                        >
                            <SearchBar
                                platform="ios"
                                round
                                autoFocus
                                inputStyle={styles.searchInputStyle}
                                inputContainerStyle={
                                    styles.searchInputContainerStyle
                                }
                                containerStyle={styles.searchContainerStyle}
                                placeholder={searchPlaceHolder}
                                cancelButtonTitle="Cancel"
                                onCancel={this.handleCancel}
                                onChangeText={this.handleChangeText}
                                clearIcon={null}
                                cancelButtonProps={{ color: '#17B3EC' }}
                                showLoading={this.props.loading}
                                searchIcon={() => (
                                    <SearchIcon
                                        iconContainerStyle={{
                                            marginBottom: 1,
                                            marginTop: 1,
                                        }}
                                        iconStyle={{
                                            tintColor: '#4ec9f3',
                                            height: 15,
                                            width: 15,
                                        }}
                                    />
                                )}
                                onSubmitEditing={this.handleOnEndSubmitting}
                                value={this.state.searchContent}
                            />
                        </View>
                        <TribeSearch
                            hideJoinButton={true}
                            callback={this.props.callback}
                            onItemSelect={this.props.onItemSelect}
                            shouldPreload={this.props.shouldPreload}
                        />
                    </KeyboardAvoidingView>
                </MenuProvider>
            </BaseOverlay>
        )
    }
}

const styles = {
    searchContainerStyle: {
        padding: 0,
        marginRight: 3,
        backgroundColor: '#ffffff',
        borderTopColor: '#ffffff',
        borderBottomColor: '#ffffff',
        alignItems: 'center',
    },
    searchInputContainerStyle: {
        backgroundColor: '#f3f4f6',
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
    headerContainerStyle: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
}

const mapStateToProps = (state) => {
    const { selectedTab, navigationState } = state.search
    const { loading } = state.search[selectedTab]

    return {
        selectedTab,
        navigationState,
        loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    const debouncedSearch = _.debounce(
        (value, type) => dispatch(handleSearch(value, type)),
        400
    )
    return {
        debouncedSearch,
        clearSearchState: clearSearchState(dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TribeSearchOverlay)
