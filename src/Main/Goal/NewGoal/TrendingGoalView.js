/** @format */

import React from 'react'
import {
    View,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { MenuProvider } from 'react-native-popup-menu'
import {
    trackWithProperties,
    EVENT as E,
} from '../../../monitoring/segment/index'

// Components
import TrendingGoalCardView from './TrendingGoalCardView'
import EmptyResult from '../../Common/Text/EmptyResult'

// Actions
import {
    selectTrendingGoalsCategory,
    refreshTrendingGoals,
    loadMoreTrendingGoals,
} from '../../../redux/modules/goal/CreateGoalActions'

// Assets
import { color } from '../../../styles/basic'
import ModalHeader from '../../Common/Header/ModalHeader'
import { Actions } from 'react-native-router-flux'
import { CATEGORY_OPTIONS } from '../../../Utils/Constants'
import GoalFilterBar from '../../Common/GoalFilterBar'

const DEBUG_KEY = '[ UI TrendingGOalView ]'
const { width } = Dimensions.get('window')

class TrendingGoalView extends React.PureComponent {
    componentDidMount() {
        console.log(`${DEBUG_KEY}: component did mount`)
        setTimeout(() => {
            trackWithProperties(E.DEEPLINK_CLICKED, {
                FunnelName: this.props.funnel,
            })
        }, 2000)

        this.handleOnRefresh()
    }

    keyExtractor = (item) => item.title

    handleOnRefresh = () => {
        this.props.refreshTrendingGoals()
    }

    handleOnLoadMore = () => {
        this.props.loadMoreTrendingGoals()
    }

    handleOnMenuSelect = (value) => {
        this.props.selectTrendingGoalsCategory(value)
    }

    renderItem = ({ item, index }) => {
        return this.props.hamburger ? (
            <TrendingGoalCardView
                index={index + 1}
                item={item}
                maybeOpenModal
            />
        ) : (
            <TrendingGoalCardView index={index + 1} item={item} />
        )
    }

    render() {
        const { refreshing, loading, category } = this.props
        return (
            <MenuProvider
                customStyles={{ backdrop: styles.backdrop }}
                skipInstanceCheck={true}
            >
                <ModalHeader
                    title="Trending Goals"
                    back
                    onCancel={() => {
                        if (this.props.onClose) this.props.onClose()
                        Actions.pop()
                    }}
                />
                <View
                    style={{
                        flex: 1,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                    }}
                >
                    <GoalFilterBar
                        onMenuChange={(type, value) =>
                            this.handleOnMenuSelect(value)
                        }
                        filter={{
                            categories: category || CATEGORY_OPTIONS[0].value,
                        }}
                        buttonText="Category"
                    />
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this.keyExtractor}
                        refreshing={refreshing}
                        onRefresh={this.handleOnRefresh}
                        onEndReached={this.handleOnLoadMore}
                        ListEmptyComponent={
                            loading || refreshing ? null : (
                                <EmptyResult
                                    text={'No Trending'}
                                    textStyle={{ paddingTop: 150 }}
                                />
                            )
                        }
                        onEndThreshold={0}
                        ListFooterComponent={
                            loading ? (
                                <View
                                    style={{
                                        flex: 1,
                                        height: 50,
                                        width,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ActivityIndicator />
                                </View>
                            ) : null
                        }
                    />
                </View>
            </MenuProvider>
        )
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'transparent',
    },
    containerStyle: {
        marginLeft: 5,
        marginRight: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15,
        paddingTop: 12,
        paddingBottom: 12,
    },
    caretStyle: {
        tintColor: '#696969',
        marginLeft: 5,
    },
    anchorStyle: {
        backgroundColor: color.GM_CARD_BACKGROUND,
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width - 14,
        },
        optionsWrapper: {},
        optionWrapper: {
            flex: 1,
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
            color: 'black',
        },
    },
}

const mapStateToProps = (state) => {
    const { trendingGoals } = state.createGoal
    const { data, refreshing, loading, category } = trendingGoals

    return {
        data,
        refreshing,
        loading,
        category,
    }
}

export default connect(mapStateToProps, {
    selectTrendingGoalsCategory,
    refreshTrendingGoals,
    loadMoreTrendingGoals,
})(TrendingGoalView)
