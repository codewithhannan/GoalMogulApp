/** @format */

import React, { Component } from 'react'
import { View, Text, Image, TextInput, FlatList } from 'react-native'
import Modal from 'react-native-modal'
import Constants from 'expo-constants'
import * as text from '../../../styles/basic/text'
import { GM_BLUE } from '../../../styles/basic/color'
import cancel from '../../../asset/utils/cancel_no_background.png'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import DelayedButton from '../../Common/Button/DelayedButton'
import CompactGoalCard from '../../Goal/GoalCard/CompactGoalCard'
import { connect } from 'react-redux'
import { default_style } from '../../../styles/basic'
import {
    refreshMyUserGoals,
    loadMoreMyUserGoals,
} from '../../../redux/modules/goal/GoalActions'
import { Actions } from 'react-native-router-flux'

class SelectGoalModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            friendsSearchText: '',
            friendsFilteredData: [],
        }
    }

    renderCancelButton = () => {
        return (
            <View
                style={{ position: 'absolute', top: 0, right: 0, padding: 10 }}
            >
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.props.closeModal()}
                    style={styles.modalCancelIconContainerStyle}
                >
                    <Image
                        source={cancel}
                        style={styles.modalCancelIconStyle}
                    />
                </DelayedButton>
            </View>
        )
    }

    searchFriends = (input) => {
        this.setState({ friendsSearchText: input })
        let friendsFilteredData = this.props.data.filter((item) => {
            return item.title.includes(input)
        })
        this.setState({ friendsFilteredData: friendsFilteredData })
    }

    componentDidMount() {
        this.props.refreshMyUserGoals()
    }

    renderItem = ({ item }) => {
        return (
            <CompactGoalCard
                item={item}
                onPress={() => {
                    this.props.closeModal()
                    setTimeout(() => {
                        Actions.push('myTribeGoalInviteFriends', {
                            accountability: true,
                        })
                    }, 500)
                }}
            />
        )
    }
    renderItemSeparator = (index) => {
        return (
            <View style={default_style.cardHorizontalSeparator} key={index} />
        )
    }
    render() {
        return (
            <Modal
                backdropColor={'black'}
                propagateSwipe
                backdropOpacity={0.5}
                isVisible={this.props.isVisible}
                onBackdropPress={() => this.props.closeModal()}
                onSwipeComplete={() => this.props.closeModal()}
                swipeDirection={'down'}
                style={{
                    marginTop: Constants.statusBarHeight + 20,
                    borderRadius: 15,
                    margin: 0,
                }}
            >
                <View
                    style={{
                        backgroundColor: 'white',
                        width: '100%',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: 5,
                    }}
                >
                    <View
                        style={{
                            ...styles.modalContainerStyle,
                            height: hp(50),
                        }}
                    >
                        <View
                            style={{
                                borderBottomColor: '#C4C4C4',
                                borderBottomWidth: hp(0.4),
                                borderRadius: wp(1),
                                marginVertical: hp(0.65),
                                width: wp(10.66),
                                alignSelf: 'center',
                            }}
                        />
                        <Text style={styles.title}>
                            Add Accountability Buddies for which goal?
                        </Text>
                        <View
                            style={{
                                justifyContent: 'center',
                                marginTop: 10,
                            }}
                        >
                            <TextInput
                                theme={{
                                    colors: {
                                        primary: GM_BLUE,
                                        underlineColor: 'transparent',
                                    },
                                }}
                                value={this.state.friendsSearchText}
                                onChangeText={this.searchFriends}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderColor: 'lightgrey',
                                    width: '95%',
                                    height: 35,
                                    marginHorizontal: 10,

                                    padding: 10,
                                }}
                                underlineColor={'transparent'}
                                placeholder={'Search'}
                            />

                            <FlatList
                                data={
                                    this.props.data &&
                                    this.state.friendsFilteredData.length > 0
                                        ? this.state.friendsFilteredData
                                        : this.props.data
                                }
                                renderItem={this.renderItem}
                                showsVerticalScrollIndicator={false}
                                keyExtractor={(item) => item._id.toString()}
                                listKey={Math.random()
                                    .toString(36)
                                    .substr(2, 9)}
                                onRefresh={this.props.refreshMyUserGoals}
                                onEndReached={this.props.loadMoreMyUserGoals}
                                refreshing={this.props.refreshing || false}
                                ListEmptyComponent={() => {
                                    return (
                                        <View
                                            style={{
                                                marginTop: 100,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily:
                                                        'SFProDisplay-Regular',
                                                    fontSize: 15,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                You have no goals to update.
                                                Create Goal first!
                                            </Text>
                                        </View>
                                    )
                                }}
                                onEndReachedThreshold={2}
                                ItemSeparatorComponent={
                                    this.renderItemSeparator
                                }
                            />
                        </View>
                    </View>

                    {this.renderCancelButton()}
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { myGoals } = state.goals
    const { data, refreshing, loading, filter } = myGoals
    return {
        data,
        loading,
        filter,
        refreshing,
    }
}

export default connect(mapStateToProps, {
    refreshMyUserGoals,
    loadMoreMyUserGoals,
})(SelectGoalModal)

const styles = {
    title: {
        fontFamily: text.FONT_FAMILY.BOLD,
        alignSelf: 'center',
        fontSize: hp(1.9),

        marginVertical: hp(1.2),
    },
    modalContainerStyle: {
        backgroundColor: 'white',
        paddingHorizontal: wp(4.26),
        borderRadius: 15,
        padding: 5,
        flex: 1,
        height: hp(52.74),
    },

    modalCancelIconContainerStyle: {
        height: 30,
        width: 30,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    modalCancelIconStyle: {
        height: 14,
        width: 14,
        tintColor: 'black',
    },
}
