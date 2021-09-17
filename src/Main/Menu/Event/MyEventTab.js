/** @format */

import React from 'react'
import { View, FlatList, TouchableOpacity, Image } from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'

// Actions
import {
    refreshEvent,
    loadMoreEvent,
    closeMyEventTab,
    myEventSelectTab,
} from '../../../redux/modules/event/MyEventTabActions'
import { openNewEventModal } from '../../../redux/modules/event/NewEventActions'

// Components
import MyEventCard from './MyEventCard'
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import MyEventFilterBar from './MyEventFilterBar'
import TabButtonGroup from '../../Common/TabButtonGroup'
import EmptyResult from '../../Common/Text/EmptyResult'

// Assets
import plus from '../../../asset/utils/plus.png'

// Styles
import { SCREENS, wrapAnalytics } from '../../../monitoring/segment'

const DEBUG_KEY = '[ UI MyEventTab ]'

class MyEventTab extends React.Component {
    componentDidMount() {
        const { initial } = this.props
        if (initial && initial.openNewEventModal) {
            setTimeout(() => {
                this.props.openNewEventModal()
            }, 300)
        }
    }

    _keyExtractor = (item) => item._id

    handleOnRefresh = () => this.props.refreshEvent()

    handleOnLoadMore = () => this.props.loadMoreEvent()

    handleIndexChange = (index) => {
        this.props.myEventSelectTab(index)
    }

    renderItem = ({ item }) => {
        return <MyEventCard item={item} />
    }

    renderTabs = (props) => {
        return <TabButtonGroup buttons={props} borderRadius={3} />
    }

    renderListHeader() {
        return null
        // return (
        //   <View>
        //     <MyEventFilterBar />
        //   </View>
        // );
    }

    renderCreateEventButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => this.props.openNewEventModal()}
            >
                <Image style={styles.iconStyle} source={plus} />
            </TouchableOpacity>
        )
    }
    // <Modal
    //   style={{ flex: 1 }}
    //   animationType='fade'
    //   visible={this.props.showModal}
    // >

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <MenuProvider
                    customStyles={{ backdrop: styles.backdrop }}
                    skipInstanceCheck={true}
                >
                    <SearchBarHeader
                        backButton
                        title="My Events"
                        onBackPress={() => this.props.closeMyEventTab()}
                    />
                    {this.renderTabs({
                        jumpToIndex: (i) => this.handleIndexChange(i),
                        navigationState: this.props.navigationState,
                    })}
                    <MyEventFilterBar />
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
                                <EmptyResult text={'No Events found'} />
                            )
                        }
                        onEndThreshold={0}
                    />
                    {this.renderCreateEventButton()}
                </MenuProvider>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { showModal, data, navigationState, loading } = state.myEventTab

    return {
        data,
        loading,
        showModal,
        navigationState,
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
    iconContainerStyle: {
        position: 'absolute',
        bottom: 20,
        right: 15,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#17B3EC',
        backgroundColor: '#4096c6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 2,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
}

export default connect(mapStateToProps, {
    refreshEvent,
    loadMoreEvent,
    closeMyEventTab,
    openNewEventModal,
    myEventSelectTab,
})(wrapAnalytics(MyEventTab, SCREENS.EVENT_TAB))
