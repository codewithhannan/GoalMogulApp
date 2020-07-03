/** @format */

import React, { Component } from 'react'
import {
    Dimensions,
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
} from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import MemberListCard from '../../Tribe/MemberListCard'
import TabButtonGroup from '../../Common/TabButtonGroup'

import flagIcon from '../../../asset/icons/flag.png'

import SearchBarHeader from '../../Common/Header/SearchBarHeader'

import {
    myTribeAdminAcceptUser,
    myTribeAdminDemoteUser,
    myTribeAdminPromoteUser,
    myTribeAdminRemoveUser,
    myTribeSelectMembersFilter,
} from '../../../redux/modules/tribe/MyTribeActions'

import {
    getMyTribeMemberNavigationState,
    myTribeMemberSelector,
} from '../../../redux/modules/tribe/TribeSelector'
import { SearchBar } from 'react-native-elements'
import { SearchIcon } from '../../../Utils/Icons'
import { DEFAULT_STYLE } from '../../../styles'
import { ALL_MEMBERS_FILTER_INDEX } from '../../../redux/modules/tribe/Tribes'

function Item({ title }) {
    return (
        <View style={styles.item}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

class MyTribeMembers extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            searchContent: '',
        }
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and remove user option is chosen
     */
    handleRemoveUser = (userId) => {
        this.props.myTribeAdminRemoveUser(userId, this.props.itemId)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and promote user option is chosen
     */
    handlePromoteUser = (userId) => {
        this.props.myTribeAdminPromoteUser(userId, this.props.itemId)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and demote user option is chosen
     */
    handleDemoteUser = (userId) => {
        this.props.myTribeAdminDemoteUser(userId, this.props.itemId)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and accept user's join request option is chosen
     */
    handleAcceptUser = (userId) => {
        this.props.myTribeAdminAcceptUser(userId, this.props.itemId)
    }

    renderItem = (member) => {
        return (
            <MemberListCard
                item={member.memberRef}
                category={member.category}
                isSelf={this.props.userId === member.memberRef._id}
                isAdmin={this.props.isAdmin}
                onRemoveUser={this.handleRemoveUser}
                onPromoteUser={this.handlePromoteUser}
                onDemoteUser={this.handleDemoteUser}
                onAcceptUser={this.handleAcceptUser}
            />
        )
    }

    _renderScene() {
        const { memberData, navigationState } = this.props

        const allMembers = memberData.filter((member) =>
            member.memberRef.name.includes(this.state.searchContent)
        )
        const admins = allMembers.filter(
            (member) => member.category === 'Admin'
        )
        const members = allMembers.filter(
            (member) => member.category === 'Member'
        )

        const { index } = navigationState || { index: ALL_MEMBERS_FILTER_INDEX }
        switch (index) {
            case ALL_MEMBERS_FILTER_INDEX:
                return (
                    <ScrollView
                        style={{ backgroundColor: 'white', marginTop: 8 }}
                    >
                        <View style={styles.headerContainer}>
                            <Text style={DEFAULT_STYLE.titleText_1}>Admin</Text>
                        </View>
                        {admins.map((admin) => this.renderItem(admin))}
                        {memberData.length > 0 && (
                            <View style={styles.headerContainer}>
                                <Text style={DEFAULT_STYLE.titleText_1}>
                                    Members
                                </Text>
                            </View>
                        )}
                        {members.map((member) => this.renderItem(member))}
                    </ScrollView>
                )
            default:
                return (
                    <ScrollView
                        style={{ backgroundColor: 'white', marginTop: 8 }}
                    >
                        {allMembers.map((member) => this.renderItem(member))}
                    </ScrollView>
                )
        }
    }

    render() {
        const { navigationState, tribeId, pageId } = this.props
        const navigation = navigationState
            ? {
                  jumpToIndex: (i) =>
                      this.props.myTribeSelectMembersFilter(
                          navigationState.routes,
                          i,
                          tribeId,
                          pageId
                      ),
                  navigationState,
              }
            : null

        return (
            <MenuProvider
                style={styles.containerStyle}
                customStyles={{ backdrop: styles.backdrop }}
            >
                <SearchBarHeader
                    title="Members"
                    backButton
                    onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                    // pageSetting
                    // handlePageSetting={() => (this.handlePageSetting(item))}
                />
                <View style={{ padding: 16, backgroundColor: 'white' }}>
                    {navigation && <TabButtonGroup buttons={navigation} />}
                    <SearchBar
                        round
                        placeholder="Search"
                        placeholderTextColor="#D3D3D3"
                        containerStyle={[
                            styles.searchBar.container,
                            { marginTop: navigation ? 16 : 0 },
                        ]}
                        inputContainerStyle={styles.searchBar.inputContainer}
                        searchIcon={() => (
                            <SearchIcon
                                iconContainerStyle={[
                                    styles.searchBar.icon.container,
                                ]}
                                iconStyle={styles.searchBar.icon.style}
                            />
                        )}
                        inputStyle={DEFAULT_STYLE.subTitleText_1}
                        onChangeText={(text) =>
                            this.setState({ searchContent: text })
                        }
                        onCancel={() => this.setState({ searchContent: '' })}
                        value={this.state.searchContent}
                    />
                </View>
                {this._renderScene()}
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        backgroundColor: '#F2F2F2',
    },
    aboutContainer: {
        padding: 20,
    },
    aboutTitle: {
        flexDirection: 'row',
    },
    imageIcon: {
        marginTop: 5,
        marginRight: 10,
    },
    headerContainer: {
        padding: 16,
        paddingBottom: 8,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F2',
    },
    searchBar: {
        container: {
            backgroundColor: 'white',
            padding: 0,
            borderWidth: 1,
            borderTopColor: '#E0E0E0',
            borderBottomColor: '#E0E0E0',
            borderColor: '#E0E0E0',
            borderRadius: 3,
        },
        inputContainer: {
            backgroundColor: 'white',
            padding: 0,
            margin: 0,
        },
        icon: {
            container: {
                marginBottom: 1,
                marginTop: 1,
            },
            style: {
                ...DEFAULT_STYLE.normalIcon_1,
                tintColor: '#828282',
            },
        },
    },
}

const mapStateToProps = (state, props) => {
    const { tribeId, pageId } = props
    const memberData = myTribeMemberSelector(state, tribeId, pageId)
    const navigationState = getMyTribeMemberNavigationState(
        state,
        tribeId,
        pageId
    )

    return {
        userId: state.user.userId,
        memberData,
        navigationState,
        isAdmin: !!navigationState,
    }
}

export default connect(mapStateToProps, {
    myTribeMemberSelector,
    myTribeAdminAcceptUser,
    myTribeAdminDemoteUser,
    myTribeAdminPromoteUser,
    myTribeAdminRemoveUser,
    myTribeSelectMembersFilter,
})(MyTribeMembers)
