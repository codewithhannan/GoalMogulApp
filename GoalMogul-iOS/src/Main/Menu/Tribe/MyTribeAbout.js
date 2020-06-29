/** @format */

import React, { Component } from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
// Component
import ProfileImage from '../../Common/ProfileImage'

// Asset
import threeDotsIcon from '../../../asset/utils/friendsSettingIcon.png'
import { DEFAULT_STYLE } from '../../../styles'

const { width } = Dimensions.get('window')
const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]
const DEBUG_KEY = '[ UI MyTribeAbout ]'

class MyTribeAbout extends Component {
    constructor(props) {
        super(props)
    }
    /**
     * Note: Tribe.js has its member pictures moved to StackedAvatars
     * @param {*} item
     */
    renderMemberStatus({ data: { members }, isUserAdmin }) {}

    render() {
        if (!this.props.data || !this.props.data.members) return <View />

        const {
            data: { members },
            tribeId,
            pageId,
        } = this.props
        const memberPictures = members
            ? members
                  .filter(
                      (member) =>
                          member.category === 'Admin' ||
                          member.category === 'Member'
                  )
                  .map((member, index) => {
                      const { memberRef } = member
                      if (index > 4 || !memberRef) return null
                      return (
                          <View style={{ margin: 1 }}>
                              <ProfileImage
                                  userId={memberRef._id}
                                  imageUrl={
                                      memberRef.profile
                                          ? memberRef.profile.image
                                          : undefined
                                  }
                              />
                          </View>
                      )
                  })
            : []

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {memberPictures}
                <TouchableOpacity
                    onPress={() =>
                        Actions.push('myTribeMembers', {
                            pageId,
                            tribeId,
                        })
                    }
                    style={{
                        backgroundColor: '#E0E0E0',
                        alignItems: 'center',
                        borderRadius: 100,
                        margin: 1,
                    }}
                >
                    <Image
                        style={DEFAULT_STYLE.profileImage_2}
                        source={threeDotsIcon}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

export default MyTribeAbout
