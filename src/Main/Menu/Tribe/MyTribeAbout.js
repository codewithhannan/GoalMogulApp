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
import DelayedButton from '../../Common/Button/DelayedButton'

// Asset
import threeDotsIcon from '../../../asset/utils/friendsSettingIcon.png'
import { default_style } from '../../../styles/basic'
import { Icon } from '@ui-kitten/components'
import { getProfileImageOrDefaultFromUser } from '../../../redux/middleware/utils'

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

    render() {
        if (!this.props.data || !this.props.data.members) return <View />
        const {
            data: { members, _id },
            tribeId,
            pageId,
        } = this.props
        const memberPictures = members
            ? members
                  .filter(
                      (member) =>
                          member &&
                          (member.category === 'Admin' ||
                              member.category === 'Member')
                  )
                  .map((member, index) => {
                      const { memberRef } = member
                      if (index > 4 || !memberRef) return null
                      return (
                          <View style={{ margin: 4 }} key={index}>
                              <ProfileImage
                                  imageUrl={getProfileImageOrDefaultFromUser(
                                      memberRef
                                  )}
                              />
                          </View>
                      )
                  })
            : []

        return (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <DelayedButton
                    touchableWithoutFeedback
                    onPress={() =>
                        Actions.push('myTribeMembers', {
                            itemId: _id,
                            pageId,
                            tribeId,
                        })
                    }
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            flexGrow: 1,
                            justifyContent: 'center',
                        }}
                    >
                        {memberPictures}
                        <View
                            style={{
                                backgroundColor: '#F2F2F2',
                                alignItems: 'center',
                                borderRadius: 100,
                                margin: 4,
                            }}
                        >
                            <Icon
                                name="dots-horizontal"
                                pack="material-community"
                                style={{
                                    ...default_style.profileImage_2,
                                    tintColor: '#333333',
                                }}
                                zIndex={1}
                            />
                        </View>
                    </View>
                </DelayedButton>
            </View>
        )
    }
}

export default MyTribeAbout
