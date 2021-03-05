/**
 * This is the about tab in Profile.js as one of the four tabs ['about', 'goals', 'posts', 'needs']
 *
 * It has two
 *
 * @format
 */

import React from 'react'
import { ScrollView } from 'react-native'

import ProfileInfoCard from './ProfileCard/ProfileInfoCard'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

class About extends React.PureComponent {
    render() {
        const { userId, pageId } = this.props
        return (
            <ScrollView>
                <ProfileInfoCard userId={userId} pageId={pageId} />
            </ScrollView>
        )
    }
}

const AboutWrapper = wrapAnalytics(About, SCREENS.PROFILE_ABOUT_TAB)

export default AboutWrapper
