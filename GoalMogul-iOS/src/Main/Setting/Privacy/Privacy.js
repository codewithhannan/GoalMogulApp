/** @format */

import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'

// Components
import SettingCard from '../SettingCard'

// Assets
import PrivacyIcon from '../../../asset/utils/privacy.png'

// Utils
import { componentKeyByTab } from '../../../redux/middleware/utils'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

class Privacy extends Component {
    constructor(props) {
        super(props)
        this.handleOnFriendSettingPressed = this.handleOnFriendSettingPressed.bind(
            this
        )
    }

    handleOnFriendSettingPressed = () => {
        const { tab } = this.props
        const componentKeyToOpen = componentKeyByTab(tab, 'friendsSetting')
        Actions.push(`${componentKeyToOpen}`)
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <ScrollView>
                    <SettingCard
                        title="Friend list"
                        explanation="Who can see your friends"
                        onPress={this.handleOnFriendSettingPressed}
                        icon={PrivacyIcon}
                    />
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { tab } = state.navigation

    return {
        tab,
    }
}

export default connect(
    mapStateToProps,
    null
)(wrapAnalytics(Privacy, SCREENS.PRIVACY))
