import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import R from 'ramda';

/* Assets */
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import defaultSelfProfile from '../../../asset/utils/defaultSelfUserProfile.png';
import love from '../../../asset/utils/love.png';
import edit from '../../../asset/utils/edit.png';
import cancel from '../../../asset/utils/cancel.png';
import Icons from '../../../asset/base64/Icons';

/* Actions */
import {
    openProfileDetailEditForm,
    updateFriendship,
    UserBanner,
    createOrGetDirectMessage,
} from '../../../actions/';

// Selector
import {
    getUserData
} from '../../../redux/modules/User/Selector';

/* Components */
import ProfileActionButton from '../../Common/Button/ProfileActionButton';
import { actionSheet, switchByButtonIndex } from '../../Common/ActionSheetFactory';
import DelayedButton from '../../Common/Button/DelayedButton';


import { IMAGE_BASE_URL } from '../../../Utils/Constants';
import { GM_BLUE_LIGHT_LIGHT, GM_BLUE, GM_BLUE_LIGHT, DEFAULT_STYLE, TEXT_COLOR_1, BACKGROUND_COLOR } from '../../../styles';
import { Actions } from 'react-native-router-flux';
import RichText from '../../Common/Text/RichText';

const { MessageIcon, AddUser, InfoIcon } = Icons;
const { width } = Dimensions.get('window');
const DEBUG_KEY = '[ Copmonent ProfileDetailCard ]';

const CANCEL_REQUEST_OPTIONS = ['Withdraw request', 'Cancel'];
const CANCEL_REQUEST_CANCEL_INDEX = 1;

const UNFRIEND_REQUEST_OPTIONS = ['Unfriend', 'Cancel'];
const UNFRIEND_REQUEST_CANCEL_INDEX = 1;

const RESPOND_REQUEST_OPTIONS = ['Accept friend request', 'Dismiss', 'Cancel'];
const RESPOND_REQUEST_CANCEL_INDEX = 2;

// TODO: use redux instead of passed in props
class ProfileDetailCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUrl: ''
        };
        this.handleEditOnPressed = this.handleEditOnPressed.bind(this);
    }

    componentDidMount() {
        const { image } = this.props.user.profile;
        // console.log(`${DEBUG_KEY}: prefetch image: ${image}`);
        if (image) {
            this.prefetchImage(image);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let prevImageUrl = '';
        if (prevProps.user && prevProps.user.profile && prevProps.user.profile.image) {
            prevImageUrl = `${IMAGE_BASE_URL}${prevProps.user.profile.image}`;
        }

        if (this.props.user && this.props.user.profile && this.props.user.profile.image) {
            const { image } = this.props.user.profile;
            const imageUrl = `${IMAGE_BASE_URL}${image}`;
            if (imageUrl !== this.state.imageUrl || imageUrl !== prevImageUrl) {
                this.prefetchImage(image);
                // console.log(`prefetching image, imageUrl: ${imageUrl}, prevImageUrl: ${prevImageUrl}`);
            }
        }
    }

    onLayout = (e) => {
        if (this.props.onLayout) {
            this.props.onLayout(e);
        }
    }

    prefetchImage(image) {
        const fullImageUrl = `${IMAGE_BASE_URL}${image}`;
        this.setState({
            imageUrl: fullImageUrl
        });
        Image.prefetch(fullImageUrl);
    }

    handleEditOnPressed() {
        const { userId, pageId } = this.props;
        this.props.openProfileDetailEditForm(userId, pageId);
    }

    handleBannerInfoIconOnPress = () => {
        const { openEarnBageModal } = this.props;
        if (openEarnBageModal) {
            openEarnBageModal();
        }
    }

    // type: ['unfriend', 'deleteFriend', 'requestFriend']
    handleButtonOnPress = (type) => {
        if (type === 'requestFriend') {
            this.props.updateFriendship(
                this.props.userId,
                '',
                'requestFriend',
                'requests.outgoing',
                undefined
            );
            return;
        }

        if (type === 'deleteFriend') {
            const cancelRequestSwitchCases = switchByButtonIndex([
                [R.equals(0), () => {
                    console.log(`${DEBUG_KEY} User withdraw request _id: `, this.props.friendship._id);
                    // this.props.blockUser(this.props.profileUserId);
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'deleteFriend',
                        'requests.outgoing',
                        undefined
                    );
                }]
            ]);

            const cancelActionSheet = actionSheet(
                CANCEL_REQUEST_OPTIONS,
                CANCEL_REQUEST_CANCEL_INDEX,
                cancelRequestSwitchCases
            );
            return cancelActionSheet();
        }

        if (type === 'unfriend') {
            const unFriendRequestSwitchCases = switchByButtonIndex([
                [R.equals(0), () => {
                    console.log(`${DEBUG_KEY} User unfriend _id: `, this.props.friendship._id);
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'deleteFriend',
                        'friends',
                        undefined
                    );
                }]
            ]);

            const unFriendActionSheet = actionSheet(
                UNFRIEND_REQUEST_OPTIONS,
                UNFRIEND_REQUEST_CANCEL_INDEX,
                unFriendRequestSwitchCases
            );
            return unFriendActionSheet();
        }

        if (type === 'respond') {
            const respondRequestSwitchCases = switchByButtonIndex([
                [R.equals(1), () => {
                    console.log(`${DEBUG_KEY} User refuse _id: `, this.props.friendship._id);
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'deleteFriend',
                        'requests.incoming',
                        undefined
                    );
                }],
                [R.equals(0), () => {
                    console.log(`${DEBUG_KEY} User accept _id: `, this.props.friendship._id);
                    this.props.updateFriendship(
                        this.props.userId,
                        this.props.friendship._id,
                        'acceptFriend',
                        'requests.incoming',
                        undefined
                    );
                }],
            ]);

            const respondActionSheet = actionSheet(
                RESPOND_REQUEST_OPTIONS,
                RESPOND_REQUEST_CANCEL_INDEX,
                respondRequestSwitchCases
            );
            return respondActionSheet();
        }
    }

    renderMessageButton() {
        if (this.props.self) return null;
        return (
            <View style={{ marginRight: 10 }}>
                <ProfileActionButton
                    source={MessageIcon}
                    onPress={() => this.handleMessageButtonOnPress()}
                    containerStyle={styles.buttonContainerStyle}
                    iconStyle={{ ...DEFAULT_STYLE.buttonIcon_1, tintColor: 'white' }}
                />
            </View>
        );
    }

    renderProfileActionButton() {
        const containerStyle = styles.buttonContainerStyle;
        const textStyle = { ...DEFAULT_STYLE.buttonText_1, color: 'white' };
        const iconStyle = { ...DEFAULT_STYLE.buttonIcon_1, tintColor: 'white' };

        if (this.props.self) {
            return (
                <ProfileActionButton
                    source={edit}
                    onPress={() => this.handleEditOnPressed()}
                    containerStyle={containerStyle}
                    iconStyle={iconStyle}
                />
            );
        }

        const status = this.props.friendship.status;

        if (this.props.needRespond) {
            return (
                <ProfileActionButton
                    source={AddUser}
                    text='Respond'
                    onPress={this.handleButtonOnPress.bind(this, 'respond')}
                    iconStyle={iconStyle}
                    containerStyle={containerStyle}
                    textStyle={textStyle}
                />
            );
        }

        switch (status) {
            case undefined:
                return (
                    <ProfileActionButton
                        source={AddUser}
                        onPress={this.handleButtonOnPress.bind(this, 'requestFriend')}
                        iconStyle={iconStyle}
                        containerStyle={{ ...containerStyle, backgroundColor: GM_BLUE_LIGHT }}
                    />
                );

            case 'Accepted':
                return (
                    <ProfileActionButton
                        text='Friend'
                        source={love}
                        onPress={this.handleButtonOnPress.bind(this, 'unfriend')}
                        textStyle={textStyle}
                        iconStyle={iconStyle}
                        containerStyle={{ ...containerStyle, backgroundColor: GM_BLUE_LIGHT }}
                    />
                );

            case 'Invited':
                return (
                    <ProfileActionButton
                        text='Cancel request'
                        source={cancel}
                        onPress={this.handleButtonOnPress.bind(this, 'deleteFriend')}
                        containerStyle={{ ...containerStyle, backgroundColor: GM_BLUE_LIGHT }}
                        textStyle={textStyle}
                        iconStyle={iconStyle}
                    />
                );

            default:
                return null;
        }
    }

    // Open iOS menu with two options
    handleMoreButtonOnPress = () => {
        const moreButtonOptions = switchByButtonIndex([
            [R.equals(0), () => { // share to Direct Chat
                // TODO: @Jay Share to direct message
                const userToShare = this.props.user;
                const chatRoomType = 'Direct';
                Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
            }],
            [R.equals(1), () => {
                // TODO: @Jay Share to group conversation
                const userToShare = this.props.user;
                const chatRoomType = 'Group';
                Actions.push('shareToChatLightBox', { userToShare, chatRoomType });
            }]
        ]);

        const moreButtonActionSheet = actionSheet(
            ['Share Profile as Direct Message', 'Share Profile to Group Chat', 'Cancel'],
            2,
            moreButtonOptions
        );
        return moreButtonActionSheet();
    }

    // Open direct message with this person
    handleMessageButtonOnPress = () => {
        this.props.createOrGetDirectMessage(this.props.userId, (err, chatRoom) => {
            // TODO: @Jia re-enable the 'Message' button
            if (err || !chatRoom) {
                return Alert.alert('Error', 'Could not start the conversation. Please try again later.');
            };
            Actions.push('chatRoomConversation', { chatRoomId: chatRoom._id });
        });
    }

    renderProfileImage(profile, isSelf) {
        const { image } = profile;
        const style = image ? styles.imageStyle : { width: 30, height: 30, margin: 40 * DEFAULT_STYLE.uiScale };
        const containerStyle = [styles.imageContainerStyle, image ? {} : {
            borderColor: '#BDBDBD',
            borderRadius: (width * 0.15),
            borderWidth: 2
        }];
        const imageUrl = `${IMAGE_BASE_URL}${image}`;
        return (
            <View style={containerStyle}>
                <Image style={style} source={image ? { uri: imageUrl } : (isSelf ? defaultSelfProfile : defaultProfilePic)} />
            </View>
        );
    }

    render() {
        const { user, self } = this.props;
        if (!user) return null;
        const { name, headline, profile } = user;
        const { location } = profile;

        return (
            <View onLayout={this.onLayout}>
                <View style={{ height: 90 * DEFAULT_STYLE.uiScale, backgroundColor: GM_BLUE_LIGHT_LIGHT }} />
                <View style={styles.topWrapperStyle}>
                    {this.renderProfileImage(profile, self)}
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 1 }} />
                        {this.renderMessageButton()}
                        {this.renderProfileActionButton()}
                    </View>
                </View>
                <View style={styles.containerStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[ styles.marginStyle, DEFAULT_STYLE.titleText_1 ]}>
                            {name}
                        </Text>
                        <UserBanner
                            user={this.props.user}
                            iconStyle={{
                                ...styles.marginStyle,
                                height: 20 * DEFAULT_STYLE.uiScale,
                                width: 17 * DEFAULT_STYLE.uiScale
                            }}
                        />
                        {this.props.self && (
                            <DelayedButton
                                onPress={this.handleBannerInfoIconOnPress}
                                style={[styles.infoIconContainerStyle, styles.marginStyle]}
                                activeOpacity={0.6}
                            >
                                <Image source={InfoIcon} style={DEFAULT_STYLE.infoIcon} />
                            </DelayedButton>
                        )}
                    </View>
                    <RichText
                        textStyle={[ styles.marginStyle, DEFAULT_STYLE.subTitleText_1 ]}
                        contentText={headline}
                        textContainerStyle={{ flexDirection: 'row' }}
                        numberOfLines={1}
                    />
                    {location && (
                        <RichText
                            textStyle={[styles.marginStyle, DEFAULT_STYLE.normalText_1 ]}
                            contentText={location}
                            textContainerStyle={{ flexDirection: 'row' }}
                            numberOfLines={1}
                        />
                    )}
                </View>
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        backgroundColor: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20
    },
    topWrapperStyle: {
        height: DEFAULT_STYLE.uiScale * 60,
        backgroundColor: BACKGROUND_COLOR,
        padding: 16
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: DEFAULT_STYLE.uiScale * 60,
        borderColor: '#BDBDBD',
        position: 'absolute',
        bottom: 10,
        left: 20,
        alignSelf: 'center',
        backgroundColor: BACKGROUND_COLOR
    },
    imageStyle: {
        width: DEFAULT_STYLE.uiScale * 120,
        height: DEFAULT_STYLE.uiScale * 120,
        borderRadius: DEFAULT_STYLE.uiScale * 60
    },
    buttonContainerStyle: {
        color: 'white',
        backgroundColor: GM_BLUE,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    marginStyle: {
        marginBottom: 5,
    },
    infoIconContainerStyle: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: TEXT_COLOR_1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        marginLeft: 5
    }
};

const mapStateToProps = (state, props) => {
    const { userId } = props;

    const self = userId === state.user.userId;

    const userObject = getUserData(state, userId, '');
    const { user, mutualFriends, friendship } = userObject;

    const friendsCount = state.meet.friends.count;
    const needRespond = friendship && friendship.initiator_id
        && (friendship.initiator_id !== state.user.userId)
        && (friendship.status === 'Invited');

    return {
        self,
        user,
        friendship,
        userId,
        friendsCount,
        mutualFriends,
        needRespond
    };
};

export default connect(
    mapStateToProps,
    {
        openProfileDetailEditForm,
        updateFriendship,
        createOrGetDirectMessage,
    }
)(ProfileDetailCard);