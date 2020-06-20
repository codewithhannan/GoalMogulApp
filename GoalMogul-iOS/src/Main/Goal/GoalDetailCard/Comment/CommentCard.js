import React from 'react';
import {
    View,
    Text,
    Keyboard
} from 'react-native';
import { connect } from 'react-redux';

// Components
import CommentUserDetail from './CommentUserDetail';
import ChildCommentCard from './ChildCommentCard';
import DelayedButton from '../../../Common/Button/DelayedButton';

// Assets
import { GM_BLUE, DEFAULT_STYLE } from '../../../../styles';
import ProfileImage from '../../../Common/ProfileImage';


const DEBUG_KEY = '[ UI CommentCard ]';

class CommentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childCommentLayouts: {},
            totalViewHeight: 0,
            keyboardHeight: 216,
            commentLength: 0,
            numberOfChildrenShowing: 3,
            showMoreCount: 3,
            showReplies: false
        };
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        const { childComments } = this.props.item;

        if (!childComments) return;

        const { commentLength } = this.state;

        // Update child comment length if new child comment is added
        if (commentLength !== childComments.length) {
            this.setState({
                ...this.state,
                commentLength: childComments.length
            });
        }
    }

    onLayout = (e, index) => {
        const childCommentLayouts = this.state.childCommentLayouts;
        childCommentLayouts[index] = {
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height,
            x: e.nativeEvent.layout.x,
            y: e.nativeEvent.layout.y,
        };
        this.setState({ childCommentLayouts, totalViewHeight: getTotalViewHeight(this.state) });
    }

    showMoreChildComments = () => {
        const { numberOfChildrenShowing, showMoreCount } = this.state;
        const { item } = this.props;
        const currentChildCommentLength = item.childComments ? item.childComments.length : 0;

        let newNumberOfChildrenShowing = numberOfChildrenShowing;
        if (numberOfChildrenShowing >= currentChildCommentLength - showMoreCount) {
            newNumberOfChildrenShowing = currentChildCommentLength;
        } else {
            newNumberOfChildrenShowing += showMoreCount;
        }
        this.setState({
            ...this.state,
            commentLength: currentChildCommentLength,
            numberOfChildrenShowing: newNumberOfChildrenShowing
        });
    }

    showLessChildComments = () => {
        const { numberOfChildrenShowing, showMoreCount } = this.state;
        let newNumberOfChildrenShowing = numberOfChildrenShowing;
        if (numberOfChildrenShowing - showMoreCount <= showMoreCount) {
            newNumberOfChildrenShowing = showMoreCount;
        } else {
            newNumberOfChildrenShowing -= showMoreCount;
        }
        this.setState({
            ...this.state,
            numberOfChildrenShowing: newNumberOfChildrenShowing
        });
    }

    componentWillUnMount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    _keyboardDidShow = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        });
    };

    _keyboardDidHide = (e) => {
        this.setState({
            keyboardHeight: e.endCoordinates.height
        });
    };

    // update user detail layout for childcomments computing
    updateUserDetailLayout = (layout) => {
        this.setState({
            userDetailLayout: layout,
            totalViewHeight: getTotalViewHeight(this.state)
        });
    }

    // Render child comments if there are some.
    renderChildComments() {
        const { item } = this.props;
        const { childComments } = item;
        if (!childComments || childComments.length === 0) return null;

        if (!this.state.showReplies) {
            const comment = childComments[childComments.length - 1];
            const { owner } = comment;
            const imageUrl = owner && owner.profile && owner.profile.image && owner.profile.image;
            const onPress = () => this.setState({ showReplies: true });
            return (
                <DelayedButton
                    activeOpacity={0.6}
                    key={childComments.length}
                    onPress={onPress}
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}
                >
                    <ProfileImage
                        imageStyle={DEFAULT_STYLE.profileImage_2}
                        imageContainerStyle={{ margin: -10, marginTop: -12, marginRight: -2 }}
                        imageUrl={imageUrl}
                        disabled
                    />
                    <Text style={DEFAULT_STYLE.smallTitle_1}>{owner.name} </Text>
                    <Text style={{ ...DEFAULT_STYLE.smallText_1, color: '#6D6D6D' }}>
                         Replied  |  {childComments.length} Repl{childComments.length > 1 ? 'ies' : 'y'}
                    </Text>
                </DelayedButton>
            );
        }

        const { numberOfChildrenShowing } = this.state;

        // For child comments, only load the first three
        const childCommentCards = childComments.map((comment, index) => {
            if (index < numberOfChildrenShowing) {
                const viewOffset = getTotalPrevHeight(this.state, index) - this.state.keyboardHeight;
                return (
                    <View
                        key={index}
                        onLayout={(e) => this.onLayout(e, `${index}`)}
                    >
                        <ChildCommentCard
                            {...this.props}
                            item={comment}
                            parentCommentId={item._id}
                            viewOffset={viewOffset}
                            userId={this.props.userId}
                        />
                    </View>
                );
            }
        });

        if (childComments.length > numberOfChildrenShowing) {
            childCommentCards.push(
                <DelayedButton
                    activeOpacity={0.6}
                    key={childComments.length}
                    onPress={this.showMoreChildComments}
                    style={{ marginTop: 10 }}
                >
                    <Text
                        style={{
                            ...DEFAULT_STYLE.normalText_1,
                            alignSelf: 'center',
                            color: GM_BLUE,
                            padding: 2
                        }}
                    >Load more replies...</Text>
                </DelayedButton>
            );
        }

        return (
            <View>
                {childCommentCards}
            </View>
        );
    }

    render() {
        const viewOffset = getTotalPrevHeight(this.state) - this.state.keyboardHeight;
        // console.log(`${DEBUG_KEY} item is: `, this.props.item);
        return (
            <View style={styles.cardContainerStyle}>
                <CommentUserDetail
                    {...this.props}
                    ref="userDetail"
                    onLayout={(layout) => this.updateUserDetailLayout(layout)}
                    viewOffset={viewOffset}
                    userId={this.props.userId}
                    childrenRenderer={this.renderChildComments.bind(this)}
                />
            </View>
        );
    }
}

const getTotalPrevHeight = (state, index) => {
    const { childCommentLayouts } = state;
    const i = index === undefined ? -1 : index

    const totalHeights = Object.entries(childCommentLayouts).reduce((total, [key, value]) => {
        if (parseInt(key, 10) > i) {
            return total + parseInt(value.height, 10);
        }
        return total;
    }, 0);

    return totalHeights;
};

const getTotalViewHeight = (state) => {
    const { userDetailLayout, childCommentLayouts } = state;

    let totalHeights = Object.entries(childCommentLayouts).reduce((total, [key, value]) => {
        return total + parseInt(value.height, 10);
    }, 0);
    if (userDetailLayout && userDetailLayout.height) {
        totalHeights -= userDetailLayout.height;
    }

    return totalHeights;
}

const styles = {
    cardContainerStyle: {
        marginBottom: 0.5,
    },

    // Styles related to child comments
    replyIconStyle: {
        height: 20,
        width: 20,
        tintColor: '#d2d2d2'
    },
    replyIconContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44
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
    null
)(CommentCard);
