/** @format */

import _ from 'lodash'
import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { MenuProvider } from 'react-native-popup-menu'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
/* Actions */
import {
    tribeRefreshUserGoals,
    tribeLoadMoreUserGoals,
} from '../../../redux/modules/tribe/MyTribeActions'
// Selector
import { getUserGoalsForTribeShare } from '../../../redux/modules/tribe/TribeSelector'
/* Styles */
import { GM_BLUE, DEFAULT_STYLE } from '../../../styles'
import GoalFilterBar from '../../Common/GoalFilterBar'
/* Components */
import SearchBarHeader from '../../Common/Header/SearchBarHeader'
import ProfileGoalCard from '../../Goal/GoalCard/ProfileGoalCard2'
import { wrapAnalytics, SCREENS } from '../../../monitoring/segment'
import EmptyResult from '../../Common/Text/EmptyResult'
import ModalHeader from '../../Common/Header/ModalHeader'
import { PRIVACY_FRIENDS } from '../../../Utils/Constants'

const DEBUG_KEY = '[ UI ProfileV2 ]'

class UserGoalsView extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.tribeRefreshUserGoals(this.props.tribeId, this.props.pageId)
    }

    handleRefresh = () => {
        this.props.tribeRefreshUserGoals(this.props.tribeId, this.props.pageId)
    }

    handleOnLoadMore = () => {
        this.props.tribeLoadMoreUserGoals(this.props.tribeId, this.props.pageId)
    }

    handleOnBackPress = () => {
        Actions.pop()
    }

    renderItem = ({ item }) => {
        return (
            <ProfileGoalCard
                item={item}
                onPress={() =>
                    Actions.push('shareModal', {
                        // shareTo: ,
                        privacy: PRIVACY_FRIENDS,
                        // itemToShare,
                        // postType,
                        // formVals: state.form.shareModal,
                        // uploading: state.newShare.uploading,
                    })
                }
            />
        )
    }

    renderFilterBar() {
        return (
            <GoalFilterBar
            // filter={this.props.filter}
            // onMenuChange={this.handleOnMenuChange}
            />
        )
    }

    renderListEmptyState() {
        return <EmptyResult text="No Goals to Share" />
    }

    renderListFooter() {
        const { loading, data } = this.props
        if (loading && data.length >= 7) {
            return (
                <View
                    style={{
                        paddingVertical: 12,
                    }}
                >
                    <ActivityIndicator size="small" />
                </View>
            )
        }
    }

    render() {
        const { data } = this.props
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <View style={styles.containerStyle}>
                    <ModalHeader title="Your Goals" back />
                    {/* {this.renderFilterBar(props)} */}
                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(i) => i._id}
                        onRefresh={this.handleRefresh}
                        onEndReached={this.handleOnLoadMore}
                        onEndReachedThreshold={2}
                        refreshing={false}
                        ListEmptyComponent={this.renderListEmptyState()}
                        ListFooterComponent={this.renderListFooter()}
                    />
                </View>
            </MenuProvider>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: 'white',
    },
    tabContainer: {
        padding: 16,
        backgroundColor: 'white',
    },
    backdrop: {
        backgroundColor: 'gray',
        opacity: 0.5,
    },
}

const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
        // Set userId to main user if no userId present in props
        const { tribeId, pageId } = props
        const data = getUserGoalsForTribeShare(state, tribeId, pageId)

        return {
            data,
        }
    }

    return mapStateToProps
}

export default connect(makeMapStateToProps, {
    tribeRefreshUserGoals,
    tribeLoadMoreUserGoals,
})(UserGoalsView)
