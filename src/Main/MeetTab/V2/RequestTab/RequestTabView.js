/**
 * This view is a central hub for incoming and outgoing request for a user
 *
 * @format
 */

import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { SceneMap, TabView } from 'react-native-tab-view'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
// actions
import { handleRefresh } from '../../../../actions'
import {
    handleRequestTabSwitchTab,
    loadMoreRequest,
} from '../../../../redux/modules/meet/MeetActions'
// Components
import SearchBarHeader from '../../../Common/Header/SearchBarHeader'
import TabButtonGroup from '../../../Common/TabButtonGroup'
import IncomingRequestTabView from './IncomingRequestTabView'
import OutgoingRequestTabView from './OutgoingRequestTabView'
import { SCREENS, wrapAnalytics } from '../../../../monitoring/segment'

class RequestTabView extends Component {
    handleIndexChange = (index) => {
        this.props.handleRequestTabSwitchTab(index)
    }

    handleSearchUpdate = () => {}

    renderScene = SceneMap({
        incoming: IncomingRequestTabView,
        outgoing: OutgoingRequestTabView,
    })

    renderHeader = (props) => {
        return (
            <View
                style={{
                    padding: 8,
                    backgroundColor: 'white',
                    marginBottom: 8,
                }}
            >
                <TabButtonGroup buttons={props} />
                {/* <SearchBar
                    ref={(searchBar) => (this.searchBar = searchBar)}
                    platform="default"
                    clearIcon={
                        <MaterialIcons name="clear" color="#777" size={21} />
                    }
                    containerStyle={{
                        backgroundColor: 'transparent',
                        padding: 0,
                        margin: 0,
                        marginTop: 16,
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                    }}
                    inputContainerStyle={{
                        backgroundColor: 'white',
                        borderRadius: 3,
                        borderColor: '#E0E0E0',
                        borderWidth: 1,
                        minHeight: 36,
                        borderBottomWidth: 1,
                    }}
                    inputStyle={{
                        fontSize: 16,
                        fontFamily: text.FONT_FAMILY.BOLD,
                        minHeight: 36,
                    }}
                    placeholder="Search"
                    onChangeText={this.handleSearchUpdate.bind(this)}
                    onClear={this.handleSearchUpdate.bind(this)}
                    searchIcon={
                        <SearchIcon
                            iconContainerStyle={{
                                marginBottom: 3,
                                marginTop: 1,
                                marginLeft: 6,
                            }}
                            iconStyle={{
                                tintColor: '#777',
                                height: 15,
                                width: 15,
                            }}
                        />
                    }
                    value={this.props.searchQuery}
                    lightTheme={true}
                /> */}
            </View>
        )
    }

    render() {
        const modalTitle = 'Invitations'
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader backButton title={modalTitle} />
                <TabView
                    navigationState={this.props.navigationState}
                    renderScene={this.renderScene}
                    renderTabBar={this.renderHeader}
                    onIndexChange={this.handleIndexChange.bind(this)}
                    useNativeDriver
                />
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#fafafa',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 6,
    },
}

const mapStateToProps = (state) => {
    const { requests } = state.meet
    const { navigationState } = requests

    return {
        navigationState,
    }
}

export default connect(mapStateToProps, {
    handleRefresh,
    loadMoreRequest,
    handleRequestTabSwitchTab,
})(wrapAnalytics(RequestTabView, SCREENS.REQUEST_TAB_VIEW))
