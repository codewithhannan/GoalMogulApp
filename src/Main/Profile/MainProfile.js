/**
 * Mounts the users profile on main profile tab
 *
 * @format
 * */

import React, { Component } from 'react'
import { connect } from 'react-redux'
/* Actions */
import { refreshProfileData } from '../../actions'

/* Components */
import ProfileV2 from './ProfileV2'

import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'

class MainProfile extends Component {
    componentDidMount() {
        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)
    }

    render() {
        const { userId } = this.props
        const pageId = this.props.refreshProfileData(userId)

        return (
            <>
                <ProfileV2 userId={userId} pageId={pageId} isMainTab={true} />
            </>
        )
    }
}

const mapStateToProps = (state) => {
    const userId = state.auth.user.userId
    return {
        userId,
    }
}

export default connect(mapStateToProps, {
    refreshProfileData,
})(wrapAnalytics(MainProfile, SCREENS.PROFILE))
