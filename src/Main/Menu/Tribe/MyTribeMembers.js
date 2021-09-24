/** @format */

import React from 'react'
import { Text, View, ScrollView } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import MemberListCard from '../../Tribe/MemberListCard'
import TabButtonGroup from '../../Common/TabButtonGroup'

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
import { default_style, color } from '../../../styles/basic'
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

    componentDidMount() {
        const { initialRoute, navigationState, tribeId, pageId } = this.props
        if (initialRoute && initialRoute === 'request') {
            this.props.myTribeSelectMembersFilter(
                navigationState.routes,
                1,
                tribeId,
                pageId
            )
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

    renderItem = (member, index) => {
        console.log('MEMBERSSS', member)
        return (
            <MemberListCard
                index={index}
                item={member.memberRef}
                isFriend={member.isFriend}
                isRequested={member.isRequested}
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

        const allMembers = memberData.filter(
            (member) =>
                member.memberRef &&
                member.memberRef.name
                    .toLowerCase()
                    .includes(this.state.searchContent.toLowerCase())
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
                        style={{ backgroundColor: color.GM_CARD_BACKGROUND }}
                    >
                        {admins.length > 0 && (
                            <View
                                style={{
                                    ...styles.headerContainer,
                                    borderTopWidth: 8,
                                    borderTopColor: color.GM_LIGHT_GRAY,
                                }}
                            >
                                <Text style={default_style.titleText_1}>
                                    Admin
                                </Text>
                            </View>
                        )}
                        {admins.map((admin, index) =>
                            this.renderItem(admin, index)
                        )}
                        {members.length > 0 && (
                            <View
                                style={{
                                    ...styles.headerContainer,
                                }}
                            >
                                <Text style={default_style.titleText_1}>
                                    Members
                                </Text>
                            </View>
                        )}
                        {members.map((member, index) =>
                            this.renderItem(member, index)
                        )}
                    </ScrollView>
                )
            default:
                return (
                    <ScrollView
                        style={{ backgroundColor: 'white', marginTop: 8 }}
                    >
                        {allMembers.map((member, index) =>
                            this.renderItem(member, index)
                        )}
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
                skipInstanceCheck={true}
            >
                <SearchBarHeader
                    title="Members"
                    backButton
                    onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                    // pageSetting
                    // handlePageSetting={() => (this.handlePageSetting(item))}
                />
                <View style={{ padding: 8, backgroundColor: 'white' }}>
                    {navigation && <TabButtonGroup buttons={navigation} />}
                    <SearchBar
                        round
                        placeholder="Search"
                        placeholderTextColor="#D3D3D3"
                        containerStyle={[
                            styles.searchBar.container,
                            { margin: 8, marginTop: 8 },
                        ]}
                        inputContainerStyle={styles.searchBar.inputContainer}
                        searchIcon={() => (
                            <SearchIcon
                                iconContainerStyle={
                                    styles.searchBar.icon.container
                                }
                                iconStyle={styles.searchBar.icon.style}
                            />
                        )}
                        inputStyle={default_style.subTitleText_1}
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
        backgroundColor: color.GM_LIGHT_GRAY,
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
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: color.GM_LIGHT_GRAY,
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
                ...default_style.normalIcon_1,
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
    myTribeAdminAcceptUser,
    myTribeAdminDemoteUser,
    myTribeAdminPromoteUser,
    myTribeAdminRemoveUser,
    myTribeSelectMembersFilter,
})(MyTribeMembers)
