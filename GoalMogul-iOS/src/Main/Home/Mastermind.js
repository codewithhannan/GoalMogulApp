/** @format */

import React, { Component } from 'react'
import { View, Image, Text, ActivityIndicator, FlatList } from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
// This is commented out as we switch back to the old implementation
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm'

// Components
import GoalCard from '../Goal/GoalCard/GoalCard'
import EmptyResult from '../Common/Text/EmptyResult'
import NextButton from '../Goal/Common/NextButton'
import GoalFeedInfoModal from './GoalFeedInfoModal'

import { markUserViewGoal } from '../../redux/modules/goal/GoalDetailActions'

// asset
import plus from '../../asset/utils/plus.png'
import informationIconBlack from '../../asset/utils/info.png'

// actions
import {
    openCreateOverlay,
    closeCreateOverlay,
    loadMoreGoals,
    refreshGoals,
    openGoalDetail,
    changeFilter,
} from '../../redux/modules/home/mastermind/actions'

import { GM_BLUE } from '../../styles'
import { Logger } from '../../redux/middleware/utils/Logger'
import DelayedButton from '../Common/Button/DelayedButton'
import { wrapAnalytics, SCREENS } from '../../monitoring/segment'

const TAB_KEY = 'mastermind'
const DEBUG_KEY = '[ UI Mastermind ]'
const WalkableView = walkthroughable(View)

class Mastermind extends Component {
    constructor(props) {
        super(props)
        this.state = {
            infoModal: false,
            onListEndReached: false,
        }
        this.scrollToTop = this.scrollToTop.bind(this)
        // Same config is used in ActivityFeed
        this.viewabilityConfig = {
            waitForInteraction: true,
            itemVisiblePercentThreshold: 100,
            minimumViewTime: 1500,
        }
    }

    componentDidMount() {
        Logger.log(`${DEBUG_KEY}: [ componentDidMount ]: refresh goals`, {}, 2)
        this.props.refreshGoals()
    }

    componentWillUnmount() {}

    closeInfoModal = () => {
        this.setState({
            ...this.state,
            infoModal: false,
        })
    }

    openInfoModal = () => {
        this.setState({
            ...this.state,
            infoModal: true,
        })
    }

    /**
     * Used by parent to scroll mastermind to top on tab pressed
     */
    scrollToTop = () => {
        const { data } = this.props
        if (!data || data.length === 0) return
        this.flatlist.scrollToIndex({
            animated: true,
            index: 0,
        })
    }

    handleCreateGoal = () => {
        this.props.openCreateOverlay()
        Actions.createGoalButtonOverlay({ tab: TAB_KEY })
    }

    handleOnViewableItemsChanged = ({ viewableItems, changed }) => {
        viewableItems.map(({ item }) => this.props.markUserViewGoal(item._id))
    }

    handleOnLoadMore = () => {
        this.setState({ ...this.state, onListEndReached: true })
        const callback = () =>
            this.setState({ ...this.state, onListEndReached: false })
        this.props.loadMoreGoals(callback)
    }

    handleOnRefresh = () => this.props.refreshGoals()

    /**
     * @param type: ['sortBy', 'orderBy', 'categories', 'priorities']
     */
    handleOnMenuChange = (type, value) => {
        this.props.changeFilter(TAB_KEY, type, value)
    }

    _keyExtractor = (item) => item._id

    renderItem = ({ item }) => {
        // TODO: render item
        // mastermind currently renders goals and needs
        // TODO: add NeedCard
        return (
            <GoalCard
                item={item}
                onPress={(goal, subItem) => {
                    // console.log('[ UI Mastermind ]: onPress with subItem: ', subItem);
                    if (subItem) {
                        this.props.openGoalDetail(goal, {
                            focusType: subItem.type,
                            focusRef: subItem._id,
                            initialShowSuggestionModal:
                                subItem.initialShowSuggestionModal === false
                                    ? false
                                    : true,
                            initialFocusCommentBox:
                                subItem.initialFocusCommentBox,
                            // commentBox is passed in to GoalDetailCardV3 as initial
                            // commentBox: true
                        })
                        return
                    }
                    this.props.openGoalDetail(goal)
                }}
            />
        )
    }

    renderInfoModal() {
        if (this.state.infoModal) {
            return (
                <GoalFeedInfoModal
                    infoModal={this.state.infoModal}
                    onClose={this.closeInfoModal}
                    onAction={() => Actions.createGoalModal()}
                />
            )
        }
        return null
    }

    renderInfoHeader() {
        return (
            <DelayedButton
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                }}
                activeOpacity={0.6}
                onPress={this.openInfoModal}
            >
                <Image
                    source={informationIconBlack}
                    style={{
                        width: 13,
                        height: 13,
                        tintColor: '#969696',
                        marginRight: 4,
                        marginLeft: 4,
                    }}
                />
                <Text
                    style={{
                        color: '#969696',
                        fontSize: 10,
                        fontWeight: '600',
                    }}
                >
                    What is the ‘Goals’ feed?
                </Text>
            </DelayedButton>
        )
    }

    // This was used in V2 where user can only create Goal here. But we decide
    // to move this function to Home component so that it won't scroll over
    renderPlus() {
        const { tutorialText, order, name, nextStepNumber } = this.props
        // console.log(`${DEBUG_KEY}: [renderPlus]: nextStepNumber <= order + 1: ${nextStepNumber <= order + 1}`);
        // console.log(`${DEBUG_KEY}: [renderPlus]: order: ${order}, nextStepNumber: ${nextStepNumber}`);

        const tutorialView =
            nextStepNumber <= order + 1 ? (
                <CopilotStep text={tutorialText} order={order} name={name}>
                    <WalkableView
                        style={{
                            height: 54,
                            width: 54,
                            borderRadius: 28,
                            position: 'absolute',
                        }}
                    />
                </CopilotStep>
            ) : null

        return (
            <DelayedButton
                activeOpacity={0.6}
                style={styles.iconContainerStyle}
                onPress={() => Actions.createGoalModal()}
            >
                <Image style={styles.iconStyle} source={plus} />
                {tutorialView}
            </DelayedButton>
        )
    }

    /**
     * This method is not used currently as we switch back to the old scrolling pattern
     */
    renderNext() {
        if (
            this.state.onListEndReached &&
            this.props.loadingMore &&
            this.props.data.length >= 4
        ) {
            return null
        }

        return (
            <View style={styles.nextIconContainerStyle}>
                <NextButton
                    onPress={() => {
                        this._carousel.snapToNext()
                    }}
                />
            </View>
        )
    }

    renderListHeader() {
        return null
    }

    renderListFooter() {
        const { loadingMore, data } = this.props
        // console.log(`${DEBUG_KEY}: loading is: ${loadingMore}, data length is: ${data.length}`);
        if (loadingMore && data.length >= 4) {
            return (
                <View
                    style={{
                        paddingVertical: 20,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    render() {
        // Following is the old implementation
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={(f) => (this.flatlist = f)}
                    data={this.props.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.props.loading}
                    onRefresh={this.handleOnRefresh}
                    onEndReached={this.handleOnLoadMore}
                    onViewableItemsChanged={this.handleOnViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                    ListHeaderComponent={this.renderListHeader()}
                    ListFooterComponent={this.renderListFooter()}
                    ListEmptyComponent={
                        this.props.loading ? null : (
                            <EmptyResult
                                text={'No Goals have been shared'}
                                textStyle={{ paddingTop: 230 }}
                            />
                        )
                    }
                    onEndThreshold={0}
                />
                {this.renderPlus()}
            </View>
        )
    }
}

const styles = {
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
        backgroundColor: GM_BLUE,
    },
    iconStyle: {
        height: 26,
        width: 26,
        tintColor: 'white',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.7,
    },
    nextIconContainerStyle: {
        position: 'absolute',
        bottom: 0,
        right: 50,
        left: 50,
        alignItems: 'center',
    },
}

const mapStateToProps = (state) => {
    const {
        showPlus,
        data,
        loading,
        filter,
        loadingMore,
        refreshing,
    } = state.home.mastermind

    return {
        showPlus,
        data,
        loading,
        filter,
        loadingMore,
        refreshing,
    }
}

export default connect(
    mapStateToProps,
    {
        openCreateOverlay,
        closeCreateOverlay,
        loadMoreGoals,
        refreshGoals,
        openGoalDetail,
        changeFilter,
        markUserViewGoal,
    },
    null,
    { withRef: true }
)(wrapAnalytics(Mastermind, SCREENS.HOME_GOAL))
