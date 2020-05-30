import _ from 'lodash';
import R from 'ramda';
import React from 'react';
import {
    // MaskedViewIOS,
    Dimensions, Image, Text, View
} from 'react-native';
// import {
//   FlingGestureHandler,
//   Directions,
//   State
// } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import { deleteGoal } from '../../../actions';
// Asset
import { ConfettiFadedBackgroundTopHalf } from '../../../asset/background';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';
import HelpIcon from '../../../asset/utils/help.png';
import LoveOutlineIcon from '../../../asset/utils/love-outline.png';
import LoveIcon from '../../../asset/utils/love.png';
import StepIcon from '../../../asset/utils/steps.png';
import { makeCaretOptions, PAGE_TYPE_MAP, decode } from '../../../redux/middleware/utils';
import { chooseShareDest } from '../../../redux/modules/feed/post/ShareActions';
import { shareGoalToMastermind } from '../../../redux/modules/goal/GoalDetailActions';
// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions';
import { likeGoal, unLikeGoal } from '../../../redux/modules/like/LikeActions';
import { subscribeEntityNotification, unsubscribeEntityNotification } from '../../../redux/modules/notification/NotificationActions';
// Actions
import { createReport } from '../../../redux/modules/report/ReportActions';
// Constants
import { CARET_OPTION_NOTIFICATION_SUBSCRIBE, CARET_OPTION_NOTIFICATION_UNSUBSCRIBE, IS_ZOOMED } from '../../../Utils/Constants';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import DelayedButton from '../../Common/Button/DelayedButton';
import ProfileImage from '../../Common/ProfileImage';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import GoalCardHeader from '../Common/GoalCardHeader';
// Components
import Headline from '../Common/Headline';
import ProgressBar from '../Common/ProgressBar';
import Timestamp from '../Common/Timestamp';
import { DEFAULT_STYLE } from '../../../styles';


const { height, width } = Dimensions.get('window');
const WINDOW_WIDTH = width;

const TabIconMap = {
    steps: {
        iconSource: StepIcon,
        iconStyle: { height: 20, width: 20 }
    },
    needs: {
        iconSource: HelpIcon,
        iconStyle: { height: 20, width: 20 }
    }
};

const DEBUG_KEY = '[ UI GoalCard ]';
const SHARE_TO_MENU_OPTTIONS = ['Share to Feed', 'Share to an Event', 'Share to a Tribe', 'Cancel'];
const CANCEL_INDEX = 3;

class GoalCard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            navigationState: {
                index: 0,
                routes: [
                    { key: 'steps', title: 'Steps' },
                    { key: 'needs', title: 'Needs' },
                ],
            }
        };
        this.updateRoutes = this.updateRoutes.bind(this);
    }

    componentDidMount() {
        const { item } = this.props;
        this.updateRoutes(item);
    }

    updateRoutes(item) {
        if (item && !_.isEmpty(item)) {
            const { steps, needs } = item;
            if (_.isEmpty(steps) && _.isEmpty(needs)) return;
            let newRoutes = [];
            let newNavigationState = {
                index: 0,
            };
            if (steps && steps.length > 0 && !_.isEmpty(steps)) {
                newRoutes = [...newRoutes, { key: 'steps', title: 'Steps' }];
            }

            if (needs && needs.length > 0 && !_.isEmpty(needs)) {
                newRoutes = [...newRoutes, { key: 'needs', title: 'Needs' }];
            }
            newNavigationState = _.set(newNavigationState, 'routes', newRoutes);
            this.setState({
                ...this.state,
                navigationState: { ...newNavigationState }
            });
        }
    }

    handleShareOnClick = () => {
        const { item } = this.props;
        const { _id } = item;

        const shareToSwitchCases = switchByButtonIndex([
            [R.equals(0), () => {
                // User choose to share to feed
                console.log(`${DEBUG_KEY} User choose destination: Feed `);
                this.props.chooseShareDest('ShareGoal', _id, 'feed', item);
                // TODO: update reducer state
            }],
            [R.equals(1), () => {
                // User choose to share to an event
                console.log(`${DEBUG_KEY} User choose destination: Event `);
                this.props.chooseShareDest('ShareGoal', _id, 'event', item);
            }],
            [R.equals(2), () => {
                // User choose to share to a tribe
                console.log(`${DEBUG_KEY} User choose destination: Tribe `);
                this.props.chooseShareDest('ShareGoal', _id, 'tribe', item);
            }],
        ]);

        const shareToActionSheet = actionSheet(
            SHARE_TO_MENU_OPTTIONS,
            CANCEL_INDEX,
            shareToSwitchCases
        );
        return shareToActionSheet();
    };

    // Card central content. Progressbar for goal card
    renderCardContent(item) {
        const { start, end, needs, steps } = item;

        return (
            <View style={{ marginTop: 16 }}>
                <ProgressBar
                    startTime={start}
                    endTime={end}
                    steps={steps}
                    needs={needs}
                    goalRef={item}
                    width={IS_ZOOMED ? 216 : 268} // TODO: use ratio with screen size rather static number
                    size='large'
                />
            </View>
        );
    }

    // user basic information
    renderUserDetail(item) {
        const { title, owner, category, _id, created, maybeIsSubscribed, viewCount, priority, isCompleted } = item;
        const timeStamp = (created === undefined || created.length === 0)
            ? new Date() : created;

        const pageId = _.get(PAGE_TYPE_MAP, 'goalFeed');

        const selfOptions = makeCaretOptions('Goal', item);

        const caret = {
            self: {
                options: selfOptions,
                onPress: (key) => {
                    if (key === 'Delete') {
                        return this.props.deleteGoal(_id, pageId);
                    }

                    let initialProps = {};
                    if (key === 'Edit Goal') {
                        initialProps = { initialShowGoalModal: true };
                        this.props.openGoalDetail(item, initialProps);
                        return;
                    }
                    if (key === 'Share to Goal Feed') {
                        // It has no pageId so it won't have loading animation
                        return this.props.shareGoalToMastermind(_id);
                    }
                    if (key === 'Mark as Complete') {
                        initialProps = {
                            initialMarkGoalAsComplete: true,
                            refreshGoal: false
                        };
                        this.props.openGoalDetail(item, initialProps);
                        return;
                    }

                    if (key === 'Unmark as Complete') {
                        initialProps = {
                            initialUnMarkGoalAsComplete: true,
                            refreshGoal: false
                        };
                        this.props.openGoalDetail(item, initialProps);
                        return;
                    }
                },
                shouldExtendOptionLength: owner._id === this.props.userId
            },
            others: {
                options: [
                    { option: 'Report' },
                    { option: maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE }
                ],
                onPress: (key) => {
                    if (key === 'Report') {
                        return this.props.createReport(_id, 'goal', 'Goal');
                    }
                    if (key === CARET_OPTION_NOTIFICATION_UNSUBSCRIBE) {
                        return this.props.unsubscribeEntityNotification(_id, 'Goal');
                    }
                    if (key === CARET_OPTION_NOTIFICATION_SUBSCRIBE) {
                        return this.props.subscribeEntityNotification(_id, 'Goal');
                    }
                },
                shouldExtendOptionLength: false
            }
        };

        return (
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <ProfileImage
                        imageUrl={owner && owner.profile ? owner.profile.image : undefined}
                        userId={owner._id}
                    />
                    <View style={{ marginLeft: 12, marginTop: 2, flex: 1 }}>
                        <Headline
                            name={owner.name}
                            category={category}
                            user={owner}
                            isSelf={owner._id === this.props.userId}
                            caret={caret}
                            textStyle={DEFAULT_STYLE.titleText_2}
                        />
                        <View style={{ marginTop: 2 }} />
                        <Timestamp time={timeago().format(timeStamp)} viewCount={viewCount} priority={priority} isCompleted={isCompleted} />
                    </View>
                </View>
                <Text
                    style={{ ...DEFAULT_STYLE.subTitleText_1, marginTop: 16, flex: 1, flexWrap: 'wrap', color: 'black' }}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    selectable
                >
                    {decode(title)}
                </Text>
            </View>
        );
    }

    renderActionButtons(item) {
        const { maybeLikeRef, _id } = item;

        const likeCount = item.likeCount ? item.likeCount : 0;
        const commentCount = item.commentCount ? item.commentCount : 0;
        const shareCount = item.shareCount ? item.shareCount : 0;

        const selfLiked = maybeLikeRef && maybeLikeRef.length > 0;

        return (
            <View style={{ marginTop: 1 }}>
                <ActionButtonGroup>
                    <ActionButton
                        iconSource={selfLiked ? LoveIcon : LoveOutlineIcon}
                        count={likeCount}
                        unitText="Like"
                        textStyle={{ color: selfLiked ? '#000' : '#828282' }}
                        iconStyle={{ tintColor: selfLiked ? '#EB5757' : '#828282' }}
                        onPress={() => {
                            if (maybeLikeRef && maybeLikeRef.length > 0) {
                                return this.props.unLikeGoal('goal', _id, maybeLikeRef);
                            }
                            this.props.likeGoal('goal', _id);
                        }}
                    />
                    <ActionButton
                        iconSource={ShareIcon}
                        count={shareCount}
                        unitText="Share"
                        textStyle={{ color: '#828282' }}
                        iconStyle={{ tintColor: '#828282' }}
                        onPress={() => this.handleShareOnClick(item)}
                    />
                    <ActionButton
                        iconSource={CommentIcon}
                        count={commentCount}
                        unitText="Comment"
                        textStyle={{ color: '#828282' }}
                        iconStyle={{ tintColor: '#828282' }}
                        onPress={() => {
                            this.props.onPress(
                                this.props.item,
                                {
                                    type: 'comment',
                                    _id: undefined,
                                    initialShowSuggestionModal: false,
                                    initialFocusCommentBox: true
                                }
                            );
                        }}
                    />
                </ActionButtonGroup>
            </View>
        );
    }
    // Original color picked for comment icon
    // #FCB110

    render() {
        const { item } = this.props;
        if (!item) return;

        return (
            <View style={{ marginTop: 10 }}>
                <View style={{ backgroundColor: 'white' }}>
                    {item.isCompleted ?
                        <Image
                            source={ConfettiFadedBackgroundTopHalf}
                            style={{
                                height: WINDOW_WIDTH * .6,
                                width: WINDOW_WIDTH,
                                position: 'absolute',
                                resizeMode: 'cover',
                                opacity: 0.55,
                            }}
                        /> : null}
                    <GoalCardHeader item={item} />
                    <View>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.props.onPress(this.props.item)}
                        >
                            <View style={{ marginTop: 14, marginBottom: 15, marginRight: 12, marginLeft: 12 }}>
                                {this.renderUserDetail(item)}
                                {this.renderCardContent(item)}
                            </View>
                        </DelayedButton>
                        <View>
                            {this.renderActionButtons(item)}
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: 'white'
    },
    viewGoalTextStyle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#17B3EC',
        alignSelf: 'center'
    },
    iconStyle: {
        alignSelf: 'center',
        fontSize: 20,
        marginLeft: 5,
        marginTop: 2
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    }
};

const mapStateToProps = state => {
    const { userId } = state.user;
    return {
        userId
    };
};

export default connect(
    mapStateToProps,
    {
        createReport,
        likeGoal,
        unLikeGoal,
        chooseShareDest,
        deleteGoal,
        subscribeEntityNotification,
        unsubscribeEntityNotification,
        openGoalDetail,
        shareGoalToMastermind
    }
)(GoalCard);