/** @format */
/** NOT USED FOR NOW */
import React from 'react'
import { connect } from 'react-redux'

import { Text, View, FlatList, ScrollView } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'

import {
    refreshTribeHub,
    refreshTribes,
    myTribeSelectTab,
    loadMoreTribes,
    TRIBE_TYPE,
} from '../../../redux/modules/tribe/TribeHubActions'
import MyTribeCard from './MyTribeCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import EmptyResult from '../../Common/Text/EmptyResult'
import { default_style, color } from '../../../styles/basic'

const EMPTY_TRIBE = 'EMPTY_TRIBE'

class MyTribeList extends React.PureComponent {
    constructor(props) {
        super(props)
    }
    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        if (item == EMPTY_TRIBE) {
            if (this.props.admin.refreshing || this.props.member.refreshing) {
                return null
            }
            return <EmptyResult text={'No Tribes found'} />
        }

        return (
            <View>
                <MyTribeCard item={item} />
            </View>
        )
    }

    renderFlatList() {
        if (this.props.isAdminList) {
            return (
                <FlatList
                    data={this.props.admin.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.admin.refreshing}
                    onRefresh={() => this.props.refreshTribes(TRIBE_TYPE.admin)}
                    onEndReached={() =>
                        this.props.loadMoreTribes(TRIBE_TYPE.admin)
                    }
                    onEndThreshold={0}
                    ListEmptyComponent={
                        this.props.admin.refreshing ? null : (
                            <EmptyResult text={'No Tribes found'} />
                        )
                    }
                />
            )
        }
        return (
            <FlatList
                data={this.props.member.data}
                renderItem={this.renderItem}
                numColumns={1}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.member.refreshing}
                onRefresh={() => this.props.refreshTribes(TRIBE_TYPE.member)}
                onEndReached={() =>
                    this.props.loadMoreTribes(TRIBE_TYPE.member)
                }
                onEndThreshold={0}
                ListEmptyComponent={
                    this.props.member.refreshing ? null : (
                        <EmptyResult text={'No Tribes found'} />
                    )
                }
            />
        )
    }

    render() {
        const title = this.props.isAdminList
            ? 'All Admin Tribes'
            : 'All Other Tribes'

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <MenuProvider skipInstanceCheck={true}>
                    <SearchBarHeader
                        title={title}
                        backButton
                        onBackPress={() => Actions.pop()} // componentWillUnmount takes care of the state cleaning
                    />
                    {this.renderFlatList()}
                </MenuProvider>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const { admin, member } = state.myTribeTab

    return {
        admin,
        member,
    }
}

export default connect(mapStateToProps, {
    refreshTribeHub,
    refreshTribes,
    loadMoreTribes,
})(MyTribeList)
