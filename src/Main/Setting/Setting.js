/** @format */

import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { TabView } from 'react-native-tab-view'

/* Components */
import SearchBarHeader from '../Common/Header/SearchBarHeader'
import Account from './Account/Account'
import Privacy from './Privacy/Privacy'
import TabButtonGroup from '../Common/TabButtonGroup'

/* Actions */
import { settingSwitchTab } from '../../redux/modules/setting/SettingActions'

/* Styles */
import { SCREENS, wrapAnalytics } from '../../monitoring/segment'

class Setting extends Component {
    handleIndexChange = (index) => {
        this.props.settingSwitchTab(index)
    }

    _renderScene = ({ route }) => {
        switch (route.key) {
            case 'account':
                return <Account />

            case 'privacy':
                return <Privacy />

            default:
                return null
        }
    }

    renderTabs(props) {
        return <TabButtonGroup buttons={props} />
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Settings"
                />
                <TabView
                    ref={(ref) => (this.tab = ref)}
                    navigationState={this.props.navigationState}
                    renderScene={this._renderScene}
                    renderTabBar={this.renderTabs.bind(this)}
                    onIndexChange={this.handleIndexChange}
                    swipeEnabled={false}
                    useNativeDriver
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { selectedTab, navigationState } = state.setting

    return {
        selectedTab,
        navigationState,
    }
}

export default connect(mapStateToProps, {
    settingSwitchTab,
})(wrapAnalytics(Setting, SCREENS.SETTING))
