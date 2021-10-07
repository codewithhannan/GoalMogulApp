/** @format */

import React from 'react'

import _ from 'lodash'
import {
    Alert,
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import { TabView } from 'react-native-tab-view'
import { Actions } from 'react-native-router-flux'
// Actions
import { closeMyTribeTab } from '../../../redux/modules/tribe/MyTribeTabActions'

import {
    refreshTribeHub,
    refreshTribes,
    myTribeSelectTab,
    loadMoreTribes,
    TRIBE_TYPE,
} from '../../../redux/modules/tribe/TribeHubActions'

import { openNewTribeModal } from '../../../redux/modules/tribe/NewTribeActions'
import { makeTribesSelector } from '../../../redux/modules/tribe/TribeSelector'

// Components
import MyTribeCard from './MyTribeCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import MyTribeFilterBar from './MyTribeFilterBar'
import TabButtonGroup from '../../Common/TabButtonGroup'
import EmptyResult from '../../Common/Text/EmptyResult'
import EarnBadgeModal from '../../Gamification/Badge/EarnBadgeModal'
import {
    trackWithProperties,
    EVENT as E,
    track,
} from '../../../monitoring/segment'
// Assets
import plus from '../../../asset/utils/plus.png'

// Styles
import { default_style, color } from '../../../styles/basic'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const DEBUG_KEY = '[ UI MyTribeTab ]'
const EMPTY_TRIBE = 'EMPTY_TRIBE'
const ADMIN_EMPTY_TRIBE = 'ADMIN_EMPTY_TRIBE'
const OTHER_TRIES = 'Other Tribes'

class MyTribeTab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showBadgeEarnModal: false,
        }
    }
    componentDidMount() {
        const { initial } = this.props
        if (initial && initial.openNewTribeModal) {
            setTimeout(() => {
                this.props.openNewTribeModal()
            }, 300)
        }
        this.props.refreshTribeHub()
    }

    renderTitle(text) {
        const isAdminTitle = text == 'Tribes You Manage'
        const allTribesTitle = isAdminTitle
            ? 'All Admin Tribes'
            : 'All Other Tribes'

        //the title should only be rendered if admin tribes are non empty
        if (!this.props.adminTribes.length) {
            return null
        }
        return (
            <View
                style={[
                    styles.titleStyle,
                    { borderTopWidth: isAdminTitle ? 0 : 8 },
                ]}
            >
                <Text style={[styles.tribeCategory, default_style.titleText_1]}>
                    {text}
                </Text>
                {/* <TouchableOpacity
                        activeOpacity={0.8}
                        onPress ={() => Actions.push('myTribeList', {
                            isAdminList:isAdminTitle,
                        })}>
                        <Text style=
                            {[default_style.titleText_2,
                                {color:color.GM_BLUE}]}
                        >
                            {allTribesTitle}
                        </Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    _keyExtractor = (item) => item._id

    renderEmptyTribepage() {
        return (
            <View>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingTop: 160,
                        paddingLeft: 100,
                        paddingRight: 100,
                    }}
                >
                    <View style={[styles.emptyTribeTextContainerStyle]}>
                        <Text
                            style={{
                                ...default_style.goalTitleText_1,
                                fontWeight: 'bold',
                            }}
                        >
                            Check out some Tribes!
                        </Text>
                    </View>
                    <View style={[styles.emptyTribeTextContainerStyle]}>
                        <Text style={default_style.titleText_1}>
                            Find and follow experts
                        </Text>
                        <Text style={{ ...default_style.subTitleText_1 }}>
                            {' '}
                            talking about your interest!
                        </Text>
                    </View>
                    <View style={[styles.emptyTribeTextContainerStyle]}>
                        <Text style={{ ...default_style.titleText_1 }}>
                            Build an audience
                        </Text>
                        <Text style={{ ...default_style.subTitleText_1 }}>
                            {' '}
                            by sharing goals and making updates!
                        </Text>
                    </View>
                </View>
                <View style={{ paddingHorizontal: 10 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.emptyTribeButtonStyle]}
                        onPress={() => {
                            Actions.push('tribeDiscover')
                            track(E.DISCOVER_TRIBE_OPEN)
                        }}
                    >
                        <Text
                            style={[
                                default_style.titleText_1,
                                styles.buttonText,
                                { color: color.GM_CARD_BACKGROUND },
                            ]}
                        >
                            Discover Tribes
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderItem = ({ item }) => {
        // render title for "My Tribes" page
        if (item === OTHER_TRIES || item === 'Tribes You Manage') {
            return this.renderTitle(item)
        }

        if (item == ADMIN_EMPTY_TRIBE) {
            return null
        }

        if (item == EMPTY_TRIBE) {
            if (this.props.admin.refreshing || this.props.member.refreshing) {
                return null
            }
            return this.renderEmptyTribepage()
        }

        let tribeAction = null
        if (this.props.requestedTribes.some((tribe) => tribe == item)) {
            tribeAction = 'requested'
        }
        if (this.props.invitedTribes.some((tribe) => tribe == item)) {
            tribeAction = 'invited'
        }

        return (
            <View>
                <MyTribeCard
                    item={item}
                    tribeAction={tribeAction}
                    pageId={this.props.pageId}
                />
            </View>
        )
    }

    renderCreateTribeButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => {
                    if (this.props.isSilverBadgePlus) {
                        this.props.openNewTribeModal()
                    } else {
                        Alert.alert(
                            'Cannot create new Tribe',
                            'Attain a silver badge to create your own tribe!',
                            [
                                {
                                    text: 'Learn more',
                                    onPress: () => {
                                        this.setState({
                                            showBadgeEarnModal: true,
                                        })
                                    },
                                },
                                {
                                    text: 'Cancel',
                                },
                            ]
                        )
                    }
                }}
            >
                <Image style={styles.iconStyle} source={plus} />
            </TouchableOpacity>
        )
    }

    _handleIndexChange = (index) => {
        this.props.myTribeSelectTab(index)
    }

    _renderHeader = (props) => {
        return (
            <View style={styles.tabContainer}>
                <TabButtonGroup buttons={props} />
            </View>
        )
    }

    _renderScene = ({ route }) => {
        // If there are no AdminData, do not render "No Tribes Found"
        let adminData = this.props.adminTribes.length
            ? ['Tribes You Manage'].concat(this.props.adminTribes)
            : Array(ADMIN_EMPTY_TRIBE)
        let memberData = this.props.memberTribes.length
            ? this.props.memberTribes
            : Array(EMPTY_TRIBE)

        switch (route.key) {
            case 'MyTribes':
                return (
                    <FlatList
                        data={adminData
                            .concat([OTHER_TRIES])
                            .concat(memberData)}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={
                            this.props.admin.refreshing ||
                            this.props.member.refreshing
                        }
                        onRefresh={() => {
                            this.props.refreshTribes(TRIBE_TYPE.admin)
                        }}
                        onEndReached={() => {
                            this.props.loadMoreTribes(TRIBE_TYPE.member)
                        }}
                        onEndThreshold={0}
                    />
                )

            case 'JoinRequester':
                return (
                    <FlatList
                        data={this.props.requestedTribes}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.requested.refreshing}
                        onRefresh={() =>
                            this.props.refreshTribes(TRIBE_TYPE.requested)
                        }
                        onEndReached={() =>
                            this.props.loadMoreTribes(TRIBE_TYPE.requested)
                        }
                        onEndThreshold={0}
                        ListEmptyComponent={
                            this.props.requested.refreshing ? null : (
                                <EmptyResult text={'No Tribes found'} />
                            )
                        }
                    />
                )

            default:
                return (
                    <FlatList
                        data={this.props.invitedTribes}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.invited.refreshing}
                        onRefresh={() =>
                            this.props.refreshTribes(TRIBE_TYPE.invited)
                        }
                        onEndReached={() =>
                            this.props.loadMoreTribes(TRIBE_TYPE.invited)
                        }
                        onEndThreshold={0}
                        ListEmptyComponent={
                            this.props.invited.refreshing ? null : (
                                <EmptyResult text={'No Tribes found'} />
                            )
                        }
                    />
                )
        }
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <SearchBarHeader
                        backButton
                        title="My Tribes"
                        onBackPress={() => this.props.closeMyTribeTab()}
                    />
                    <TabView
                        // ref={(ref) => (this.tab = ref)}
                        navigationState={this.props.navigationState}
                        renderScene={this._renderScene}
                        renderTabBar={this._renderHeader}
                        onIndexChange={this._handleIndexChange}
                    />
                    <EarnBadgeModal
                        isVisible={this.state.showBadgeEarnModal}
                        closeModal={() => {
                            this.setState({
                                showBadgeEarnModal: false,
                            })
                        }}
                        user={this.props.user}
                    />
                    {this.renderCreateTribeButton()}
                </MenuProvider>
            </View>
        )
    }
}
const makeMapStateToProps = () => {
    const managedTribeSelector = makeTribesSelector()

    const mapStateToProps = (state) => {
        const { user } = state.user
        const level = _.get(
            user,
            'profile.badges.milestoneBadge.currentMilestone',
            1
        )
        const isSilverBadgePlus = level >= 2
        const {
            showModal,
            loading,
            data,
            admin,
            member,
            requested,
            invited,
            navigationState,
        } = state.myTribeTab
        let adminTribes = managedTribeSelector(state, TRIBE_TYPE.admin)
        let memberTribes = managedTribeSelector(state, TRIBE_TYPE.member)
        let requestedTribes = managedTribeSelector(state, TRIBE_TYPE.requested)
        let invitedTribes = managedTribeSelector(state, TRIBE_TYPE.invited)

        return {
            user,
            data,
            loading,
            showModal,
            admin,
            member,
            requested,
            invited,
            adminTribes,
            memberTribes,
            requestedTribes,
            invitedTribes,
            navigationState,
            isSilverBadgePlus,
        }
    }
    return mapStateToProps
}

const styles = {
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
    createButtonContainerStyle: {
        height: 30,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-end',
        marginRight: 20,
        backgroundColor: '#efefef',
        borderRadius: 5,
    },
    separator: {
        width: 0.5,
        color: 'gray',
    },
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 29,
        height: 54,
        width: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3,
        backgroundColor: color.GM_BLUE,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
    tribeCategory: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    tabContainer: {
        paddingVertical: 8,
        borderBottomWidth: 8,
        borderColor: color.GM_BACKGROUND,
    },
    titleStyle: {
        padding: 16,
        backgroundColor: color.GM_CARD_BACKGROUND,
        borderColor: color.GM_BACKGROUND,
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    emptyTribeButtonStyle: {
        backgroundColor: color.GM_BLUE,
        borderRadius: 3,
        flex: 1,
    },
    buttonText: {
        ...default_style.buttonText_1,
        textAlign: 'center',
        margin: 7,
    },
    emptyTribeTextContainerStyle: {
        ...default_style.titleText_1,
        marginBottom: 20,
        flexDirection: 'row',
        flex: 1,
    },
}

export default connect(makeMapStateToProps, {
    refreshTribeHub,
    refreshTribes,
    loadMoreTribes,
    closeMyTribeTab,
    openNewTribeModal,
    myTribeSelectTab,
})(wrapAnalytics(MyTribeTab, SCREENS.TRIBE_TAB))
