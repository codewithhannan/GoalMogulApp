/** @format */

import React, { Component } from 'react'
import { Dimensions, Text, View, Image, FlatList } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import MemberListCard from '../../Tribe/MemberListCard'
import TabButtonGroup from '../../Common/TabButtonGroup'

import flagIcon from '../../../asset/icons/flag.png'

import SearchBarHeader from '../../Common/Header/SearchBarHeader'

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
        console.log(this.props.data)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and remove user option is chosen
     */
    handleRemoveUser = (userId) => {
        const { _id } = this.props.item
        this.props.item.myTribeAdminRemoveUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and promote user option is chosen
     */
    handlePromoteUser = (userId) => {
        const { _id } = this.props.item
        this.props.item.myTribeAdminPromoteUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and demote user option is chosen
     */
    handleDemoteUser = (userId) => {
        const { _id } = this.props.item
        this.props.item.myTribeAdminDemoteUser(userId, _id)
    }

    /**
     * This function is passed to MemberListCard when setting icon is clicked
     * and accept user's join request option is chosen
     */
    handleAcceptUser = (userId) => {
        const { _id } = this.props.item
        this.props.item.myTribeAdminAcceptUser(userId, _id)
    }

    renderItem = (props) => {
        const { isUserAdmin } = this.props.item
        return (
            <MemberListCard
                item={props.item.memberRef}
                category={props.item.category}
                key={props.item.index}
                isAdmin={isUserAdmin}
                onRemoveUser={this.handleRemoveUser}
                onPromoteUser={this.handlePromoteUser}
                onDemoteUser={this.handleDemoteUser}
                onAcceptUser={this.handleAcceptUser}
            />
            // <Text>test</Text>
        )
    }

    render() {
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <View>
                    <SearchBarHeader
                        backButton
                        onBackPress={() => this._handleIndexChange(1)} // componentWillUnmount takes care of the state cleaning
                        pageSetting
                        handlePageSetting={() => this.handlePageSetting(item)}
                    />
                    {/* <TabButtonGroup buttons={props} subTab buttonStyle={buttonStyle} noVerticalDivider noBorder /> */}
                    <View
                        style={{
                            height: 1,
                            width: '100%',
                            backgroundColor: '#DADADA',
                        }}
                    />
                </View>

                <View style={styles.containerStyle}>
                    <FlatList
                        ref="flatList"
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                    />
                    <Text>test test test</Text>
                </View>
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
    },
    aboutContainer: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '700',
    },
    aboutTitle: {
        flexDirection: 'row',
    },
    imageIcon: {
        marginTop: 5,
        marginRight: 10,
    },
}

export default connect()(MyTribeMembers)
