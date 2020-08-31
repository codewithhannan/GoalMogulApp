/** @format */

import React from 'react'
import { Alert, View, FlatList, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import _ from 'lodash'

// Actions
import {
    refreshTribe,
    loadMoreTribe,
    closeMyTribeTab,
    myTribeSelectTab,
} from '../../../redux/modules/tribe/MyTribeTabActions'

import { openNewTribeModal } from '../../../redux/modules/tribe/NewTribeActions'

// Components
import MyTribeCard from './MyTribeCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import MyTribeFilterBar from './MyTribeFilterBar'
import TabButtonGroup from '../../Common/TabButtonGroup'
import EmptyResult from '../../Common/Text/EmptyResult'
import EarnBadgeModal from '../../Gamification/Badge/EarnBadgeModal'

// Assets
import plus from '../../../asset/utils/plus.png'

// Styles
import { default_style, color } from '../../../styles/basic'
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const DEBUG_KEY = '[ UI MyTribeTab ]'

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
        this.props.refreshTribe()
    }

    _keyExtractor = (item) => item._id

    handleOnRefresh = () => this.props.refreshTribe()

    handleOnLoadMore = () => this.props.loadMoreTribe()

    handleIndexChange = (index) => {
        this.props.myTribeSelectTab(index)
    }

    renderItem = ({ item }) => {
        return <MyTribeCard item={item} />
    }

    renderTabs = (props) => {
        return <TabButtonGroup buttons={props} />
    }

    renderListHeader() {
        return (
            <View>
                <MyTribeFilterBar />
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
    // ListHeaderComponent={this.renderListHeader()}
    // <Modal
    //   style={{ flex: 1 }}
    //   animationType='fade'
    //   visible={this.props.showModal}
    // >

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                    <SearchBarHeader
                        backButton
                        title="My Tribes"
                        onBackPress={() => this.props.closeMyTribeTab()}
                    />
                    {this.renderTabs({
                        jumpToIndex: (i) => this.handleIndexChange(i),
                        navigationState: this.props.navigationState,
                    })}
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this._keyExtractor}
                        refreshing={this.props.loading}
                        onRefresh={this.handleOnRefresh}
                        onEndReached={this.handleOnLoadMore}
                        ListHeaderComponent={this.renderListHeader()}
                        ListEmptyComponent={
                            this.props.loading ? null : (
                                <EmptyResult text={'No Tribes found'} />
                            )
                        }
                        onEndThreshold={0}
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

const mapStateToProps = (state) => {
    const { showModal, loading, data, navigationState } = state.myTribeTab
    const { user } = state.user
    const level = _.get(
        user,
        'profile.badges.milestoneBadge.currentMilestone',
        1
    )
    const isSilverBadgePlus = level >= 2

    return {
        user,
        data,
        loading,
        showModal,
        navigationState,
        isSilverBadgePlus,
    }
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
}

export default connect(mapStateToProps, {
    refreshTribe,
    loadMoreTribe,
    closeMyTribeTab,
    openNewTribeModal,
    myTribeSelectTab,
})(wrapAnalytics(MyTribeTab, SCREENS.TRIBE_TAB))
