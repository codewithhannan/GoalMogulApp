/** @format */

import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import { CheckIcon } from '../../../Utils/Icons'

/* Styles */
import Styles from '../Styles'

/* Actions */
import {
    onFriendsSettingSelection,
    updateFriendsSetting,
} from '../../../actions'
import { Actions } from 'react-native-router-flux'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'

/*
  TODO: export this const file
*/
const friendsSettingList = [
    {
        title: 'Public',
        explanation: "Everyone can see who I'm friends with",
    },
    {
        title: 'Mutual',
        explanation: 'Anyone can see the friends we have in common',
    },
    {
        title: 'Friends',
        explanation: "Friends can see who I'm friends with",
    },
    {
        title: 'Private',
        explanation: "Only I know who I'm friends with",
    },
]

class FriendsSetting extends Component {
    componentWillUnmount() {
        this.props.updateFriendsSetting()
    }

    handleOnSelectedPress(id) {
        this.props.onFriendsSettingSelection(id)
    }

    renderTick(info) {
        if (info.title === this.props.privacy.friends) {
            return (
                <CheckIcon
                    iconContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    iconStyle={{ tintColor: 'black', height: 18, width: 24 }}
                />
            )
        }
    }

    // <View style={{ height: 20, width: 20 }} >
    //   <Icon
    //     type='entypo'
    //     name='check'
    //     size={22}
    //   />
    // </View>

    renderPrivacySettingDetail() {
        return friendsSettingList.map((info) => {
            return (
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={this.handleOnSelectedPress.bind(this, info.title)}
                    key={Math.random().toString(36).substr(2, 9)}
                >
                    <View style={styles.sectionContainerStyle}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.titleTextStyle}>
                                {info.title}
                            </Text>
                            <Text style={styles.explanationStyle}>
                                {info.explanation}
                            </Text>
                        </View>
                        {this.renderTick(info)}
                    </View>
                </TouchableOpacity>
            )
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SearchBarHeader
                    backButton
                    rightIcon="empty"
                    title="Friends"
                    onBackPress={() => Actions.pop()}
                />
                <View style={Styles.titleSectionStyle}>
                    <Text style={Styles.titleTextStyle}>
                        Who can see your friends
                    </Text>
                </View>
                <View style={Styles.detailCardSection}>
                    {this.renderPrivacySettingDetail()}
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { privacy } = state.setting

    return {
        privacy,
    }
}

const styles = {
    sectionContainerStyle: {
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleTextStyle: {
        fontSize: 14,
        fontWeight: '700',
    },
    explanationStyle: {
        fontSize: 13,
        color: '#4d525b',
    },
}

export default connect(mapStateToProps, {
    onFriendsSettingSelection,
    updateFriendsSetting,
})(wrapAnalytics(FriendsSetting, SCREENS.FRIENDS_SETTING))
