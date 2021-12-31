/** @format */

import React, { useState, useEffect } from 'react'
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import ModalHeader from '../../Common/Header/ModalHeader'
import DelayedButton from '../../Common/Button/DelayedButton'
import { text } from '../../../styles/basic'
import {
    setSelected,
    clearSelected,
} from '../../../redux/modules/SeekHelp/seekHelpAction'
import { postHelpFriends } from '../../../redux/modules/SeekHelp/seekHelpAction'

import Selected from '../../../asset/icons/selected.png'
import unselected from '../../../asset/icons/unSelected.png'

const data = [
    {
        title: 'All Friends',
        subTitle: 'Your friends on GoalMogul',
        icon: require('../../../asset/icons/allFriends.png'),
        key: 'allFriends',
    },
    {
        title: 'Friends Except',
        subTitle: 'Friends; Except:...',
        icon: require('../../../asset/icons/friendsExcept.png'),
        key: 'friendsExcept',
    },
    {
        title: 'Close Friends',
        subTitle: 'Your close friends on GoalMogul',
        icon: require('../../../asset/icons/closeFriends.png'),
        key: 'closeFriends',
    },
    {
        title: 'Close Friends Except',
        subTitle: 'Your close friends on GoalMogul',
        icon: require('../../../asset/icons/closeFriendsExcept.png'),
        key: 'closeFriendsExcept',
    },
    {
        title: 'Specific Friends',
        subTitle: 'Only show to some friends',
        icon: require('../../../asset/icons/specificFriends.png'),
        key: 'specificFriends',
    },
    {
        title: 'Custom group of friends',
        subTitle: 'Only show to custom group of friends you have created',
        icon: require('../../../asset/icons/customFriends.png'),
        key: 'customGroupOfFriends',
    },
]

const SeekHelp = ({
    setSelected,
    selected,
    clearSelected,
    postHelpFriends,
    helpText,
    user,
    lateGoal,
}) => {
    useEffect(() => {
        return () => {
            clearSelected()
        }
    }, [])

    const renderItem = ({ item }) => {
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        setSelected(item)
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: 75,
                            flexDirection: 'row',
                            padding: 15,
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={item.icon}
                            style={{ height: 25, width: 25 }}
                            resizeMode="contain"
                        />
                        <View style={{ paddingHorizontal: 10, marginTop: 15 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>
                                {item.title}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    fontWeight: '300',
                                    marginTop: 5,
                                }}
                            >
                                {item.subTitle}
                            </Text>
                        </View>
                        <Image
                            resizeMode="contain"
                            source={item === selected ? Selected : unselected}
                            style={{
                                height: 15,
                                width: 15,
                                position: 'absolute',
                                right: 15,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: 0.5,
                            backgroundColor: '#E0E0E0',
                        }}
                    />
                </TouchableOpacity>
            </>
        )
    }

    const renderActionIcons = () => {
        // const actionIconStyle = { ...styles.actionIconStyle }
        // const actionIconWrapperStyle = { ...styles.actionIconWrapperStyle }
        return (
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(index) => index.toString()}
            />
        )
    }

    return (
        <MenuProvider
            customStyles={{ backdrop: styles.backdrop }}
            skipInstanceCheck={true}
        >
            <ModalHeader
                title="Seek Help"
                back
                // actionText={actionText}
                onCancel={() => {
                    // const durationSec =
                    //     (new Date().getTime() -
                    //         this.startTime.getTime()) /
                    //     1000
                    // trackWithProperties(
                    //     this.props.initializeFromState
                    //         ? E.EDIT_TRIBE_MODAL_CANCELLED
                    //         : E.CREATE_TRIBE_MODAL_CANCELLED,
                    //     { DurationSec: durationSec }
                    // )
                    Actions.pop()
                }}
                // onAction={handleSubmit(this.handleCreate)}
                // actionDisabled={this.props.uploading}
            />

            {/* <ScrollView
                        style={{ borderTopColor: '#E5E5E5', borderTopWidth: 1 }}
                    > */}
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        width: '100%',
                        backgroundColor: 'white',
                        padding: 15,
                        justifyContent: 'center',
                        paddingVertical: 20,
                    }}
                >
                    <Text style={styles.titleTextStyle}>
                        Where do you want to Seek Help from?
                    </Text>
                </View>
                <View
                    style={{
                        width: '100%',
                        height: 0.5,
                        backgroundColor: '#E0E0E0',
                    }}
                />
                {renderActionIcons()}
                <DelayedButton
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 40,
                        width: '90%',
                        backgroundColor: '#42C0F5',
                        alignSelf: 'center',
                        marginVertical: 10,
                        justifyContent: 'center',
                        borderRadius: 2,
                        marginBottom: 30,
                    }}
                    onPress={() => {
                        if (
                            selected.key === 'friendsExcept' ||
                            selected.key === 'closeFriendsExcept' ||
                            selected.key === 'specificFriends'
                        ) {
                            return Actions.push('seekHelpFriendList', {
                                helpText: helpText,
                            })
                        } else
                            return postHelpFriends({
                                helpText: helpText,
                                user: user,
                                goal: lateGoal,
                                privacy:
                                    selected.key === 'allFriends'
                                        ? 'friends'
                                        : 'close-friends',
                            })
                    }}
                >
                    <Text
                        style={{
                            fontFamily: text.FONT_FAMILY.SEMI_BOLD,
                            fontWeight: '600',
                            fontSize: 15,
                            color: 'white',
                        }}
                    >
                        Submit
                    </Text>
                </DelayedButton>
            </View>
            {/* </ScrollView> */}
        </MenuProvider>
    )
}

const mapStateToProps = (state) => {
    const seekHelp = state.seekHelp
    const { selected, tribeSeek } = seekHelp
    // const { data, loading, sortBy } = state.tribeTab
    // const seekHelp = state.seekHelp
    // const { tribeSeek } = seekHelp
    const { user, token } = state.user
    const lateGoal = state.profile.lateGoal

    return {
        selected,
        user,
        token,
        lateGoal,
    }
}
export default connect(mapStateToProps, {
    setSelected,
    clearSelected,
    postHelpFriends,
})(SeekHelp)

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'transparent',
    },
    titleTextStyle: {
        fontSize: 18,
        fontWeight: '600',
        padding: 2,
    },
})
