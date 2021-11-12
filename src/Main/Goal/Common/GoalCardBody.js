/** @format */

import React from 'react'
import { View, Image, Dimensions, FlatList } from 'react-native'
import { Icon } from '@ui-kitten/components'
import { connect } from 'react-redux'
import _ from 'lodash'
import { Video } from 'expo-av'

import { default_style, color } from '../../../styles/basic'

import {
    refreshGoalUpdates,
    loadMoreGoalUpdates,
} from '../../../redux/modules/goal/GoalActions'
import { openPostDetailById } from '../../../redux/modules/feed/post/PostActions'
import { makeGetGoalUpdatesById } from '../../../redux/modules/goal/selector'

import DelayedButton from '../../Common/Button/DelayedButton'
import CreatePostModal from '../../Post/CreatePostModal'
import ProgressBar from './ProgressBar'

import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import { Text } from 'react-native-animatable'

const DEBUG_KEY = '[ UI GoalCardBody ]'
const UPDATES_BAKCGROUND_OPACITIES = [
    0.225,
    0.2,
    0.175,
    0.15,
    0.125,
    0.1,
    0.075,
    0.05,
]
const CONTAINER_WIDTH = 130
const CONTAINER_MARGIN = 12
const MAX_UPDATES_CONTAINERS = Math.floor(
    // (width - margin - add button width) / Space required by each update
    (Dimensions.get('window').width - 32) /
        (CONTAINER_WIDTH - 50 + CONTAINER_MARGIN)
)

class GoalCardBody extends React.Component {
    constructor(props) {
        super(props)
        this.renderEmptyUpdateContainer = this.renderEmptyUpdateContainer.bind(
            this
        )
        this.renderItem = this.renderItem.bind(this)
    }

    componentDidMount() {
        const { pageId, goalId } = this.props
        this.props.refreshGoalUpdates(goalId, pageId)
    }

    handleLoadMore = () =>
        this.props.loadMoreGoalUpdates(this.props.goalId, this.props.pageId)

    keyExtractor = (item) => item._id.toString()

    renderItem({ item }) {
        if (!item) return <View />
        const mediaType = item.mediaRef ? item.mediaRef.split('/')[0] : null
        return (
            <DelayedButton
                onPress={() => this.props.openPostDetailById(item._id)}
                style={{ marginLeft: CONTAINER_MARGIN }}
            >
                {mediaType === 'FeedImage' ? (
                    <Image
                        source={{ uri: `${IMAGE_BASE_URL}${item.mediaRef}` }}
                        style={styles.updatesImageStyle}
                    />
                ) : mediaType === 'FeedVideo' ? (
                    <Video
                        // ref={videoRef}
                        source={{ uri: imageUrl }}
                        style={[styles.mediaStyle, { borderRadius: 5 }]}
                        resizeMode="cover"
                        onPlaybackStatusUpdate={(status) =>
                            this.setState({ status })
                        }
                    />
                ) : (
                    <View
                        style={[
                            styles.updatesImageStyle,
                            {
                                backgroundColor: 'black',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 5,
                            },
                        ]}
                    >
                        <Text
                            style={{ fontSize: 4, color: 'white' }}
                            numberOfLines={2}
                        >
                            {item.content.text}
                        </Text>
                    </View>
                )}
            </DelayedButton>
        )
    }

    renderEmptyUpdateContainer(opacity, i) {
        if (this.emptyContainersToDisplay <= 0) return null
        this.emptyContainersToDisplay = this.emptyContainersToDisplay - 1
        return <View style={[styles.updatesContainer, { opacity }]} key={i} />
    }

    renderAddUpdateButton() {
        const { goalRef, pageId } = this.props
        return [
            <View
                style={{
                    height: 40,
                    width: 40,
                    borderStyle: 'dashed',
                    borderColor: '#A0A0A2',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 50,
                    marginHorizontal: 20,
                    alignSelf: 'center',
                }}
            >
                <DelayedButton
                    style={styles.buttonContainer}
                    onPress={() =>
                        this.createPostModal && this.createPostModal.open()
                    }
                >
                    <Icon
                        pack="material-community"
                        name="plus"
                        style={{
                            height: 33 - 9,
                            width: 33 - 9,
                            color: '#A0A0A2',
                            backgroundColor: 'white',
                        }}
                    />
                    {/* <Icon
                    pack="material-community"
                    name="plus"
                    style={{
                        height: CONTAINER_WIDTH - 9,
                        width: CONTAINER_WIDTH - 9,
                        color: 'black',
                    }}
                /> */}
                </DelayedButton>
            </View>,
            <CreatePostModal
                onRef={(r) => (this.createPostModal = r)}
                initializeFromGoal
                initialPost={{
                    belongsToGoalStoryline: {
                        goalRef: goalRef._id,
                        title: goalRef.title,
                        owner: goalRef.owner,
                        category: goalRef.category,
                        priority: goalRef.priority,
                    },
                    privacy: goalRef.privacy,
                }}
                pageId={pageId}
            />,
        ]
    }

    renderUpdates() {
        const { data, isSelf } = this.props
        const numOfUpdates = (data && data.length) || 0
        // this.emptyContainersToDisplay =
        //     MAX_UPDATES_CONTAINERS - numOfUpdates - (isSelf ? 0 : 0)
        this.emptyContainersToDisplay = 0

        return (
            <View>
                <View
                    style={[
                        // default_style.cardHorizontalSeparator,
                        { width: '100%', marginBottom: 12 },
                    ]}
                />
                <View style={{ flexDirection: 'row' }}>
                    {/* <View
                        style={{
                            flexDirection: 'row',
                            // width:
                            //     numOfUpdates *
                            //         (CONTAINER_MARGIN + CONTAINER_WIDTH - 50) +
                            //     // account for button width if self
                            //     (isSelf ? CONTAINER_WIDTH - 50 : 0),
                        }}
                    > */}
                    {
                        /* Add a update button */
                        isSelf && this.renderAddUpdateButton()
                    }
                    {/* updates content */}
                    <FlatList
                        data={data}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={this.keyExtractor}
                        listKey={Math.random().toString(36).substr(2, 9)}
                        renderItem={this.renderItem}
                        horizontal
                        scrollEnabled={
                            numOfUpdates > MAX_UPDATES_CONTAINERS - 1
                        }
                        onEndReached={this.handleLoadMore}
                        onEndReachedThreshold={2}
                    />
                    {/* </View> */}
                    <View style={{ flexDirection: 'row', left: -20 }}>
                        {
                            /* empty container if needed to fill empty space */
                            UPDATES_BAKCGROUND_OPACITIES.map(
                                this.renderEmptyUpdateContainer
                            )
                        }
                    </View>
                </View>
                <View
                    style={[
                        // default_style.cardHorizontalSeparator,
                        { width: '100%', marginVertical: 12 },
                    ]}
                />
            </View>
        )
    }

    // Turn it into class or figure our function component mounting
    render() {
        const { data, isSelf, onPress } = this.props
        const goalBody = (
            <View style={this.props.containerStyle}>
                {(isSelf || (Array.isArray(data) && data.length > 0)) &&
                    this.renderUpdates()}
                <ProgressBar {...this.props} />
            </View>
        )
        if (onPress)
            return (
                <DelayedButton touchableWithoutFeedback onPress={onPress}>
                    {goalBody}
                </DelayedButton>
            )
        return goalBody
    }
}

const styles = {
    buttonContainer: {
        // height: CONTAINER_WIDTH,
        // width: CONTAINER_WIDTH - 50,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    updatesContainer: {
        height: CONTAINER_WIDTH,
        width: CONTAINER_WIDTH - 50,
        backgroundColor: '#E9E9E9',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: color.GM_MID_GREY,
        borderRadius: 3,
        marginLeft: 10,
    },
    updatesImageStyle: {
        height: CONTAINER_WIDTH,
        width: CONTAINER_WIDTH - 50,
        borderColor: color.GM_MID_GREY,
        borderRadius: 3,
    },
}

const makeMapStateToProps = () => {
    const getGoalUpdates = makeGetGoalUpdatesById()
    const mapStateToProps = (state, props) => {
        const { goalRef } = props
        const goalId = goalRef._id
        const pageId = props.pageId || 'feed'
        const { refreshing, loading, data } = getGoalUpdates(
            state,
            goalId,
            pageId
        )

        const isSelf =
            _.get(state, 'user.userId', '') ===
            _.get(goalRef, 'owner._id', 'no_id')

        return {
            goalId,
            pageId,
            refreshing,
            loading,
            data,
            isSelf,
        }
    }
    return mapStateToProps
}

//TODO: validate prop types
export default connect(makeMapStateToProps, {
    refreshGoalUpdates,
    loadMoreGoalUpdates,
    openPostDetailById,
})(GoalCardBody)
