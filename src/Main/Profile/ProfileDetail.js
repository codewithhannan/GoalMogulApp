/** @format */

import React, { Component } from 'react'
import { View, ScrollView } from 'react-native'
import { connect } from 'react-redux'

/* Component */
import ProfileDetailCard from './ProfileCard/ProfileDetailCard'
import ProfileInfoCard from './ProfileCard/ProfileInfoCard'
import SearchBarHeader from '../Common/Header/SearchBarHeader'

// Actions
import { closeProfileDetail } from '../../actions/ProfileActions'

// Selector
import { getUserData } from '../../redux/modules/User/Selector'
import { SCREENS, wrapAnalytics } from '../../monitoring/segment'

class ProfileDetail extends Component {
    constructor(props) {
        super(props)
        this.handleOnBackPress = this.handleOnBackPress.bind(this)
    }

    handleOnBackPress = () => {
        const { userId, pageId } = this.props
        this.props.closeProfileDetail(userId, pageId)
    }

    render() {
        const { user } = this.props
        if (!user) return null
        const { elevatorPitch, occupation } = user.profile
        let backgroundColor = '#f8f8f8'
        if (occupation || elevatorPitch) {
            backgroundColor = 'white'
        }
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader
                    backButton
                    setting
                    onBackPress={this.handleOnBackPress}
                    userId={this.props.userId}
                />
                <ScrollView style={{ backgroundColor }}>
                    <ProfileDetailCard
                        pageId={this.props.pageId}
                        userId={this.props.userId}
                    />
                    <ProfileInfoCard
                        userId={this.props.userId}
                        pageId={this.props.pageId}
                    />
                </ScrollView>
            </View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
    },
}

// TODO: profile reducer redesign to change here.
const mapStateToProps = (state, props) => {
    const { userId } = props
    const userObject = getUserData(state, userId, '')
    const { user } = userObject

    return {
        userId,
        user,
    }
}

export default connect(mapStateToProps, {
    closeProfileDetail,
})(wrapAnalytics(ProfileDetail, SCREENS.PROFILE_DETAIL))
