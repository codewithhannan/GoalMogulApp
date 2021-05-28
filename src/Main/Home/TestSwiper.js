/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    Dimensions,
    StyleSheet,
    Image,
    SafeAreaView,
} from 'react-native'

import MissingProfile from '../../asset/image/MissingProfile.png'
import GreenBadge from '../../asset/image/Green_Badge.png'
import BronzeBadge from '../../asset/image/Bronze_Badge.png'
import SilverBadge from '../../asset/image/Silver_Badge.png'
import GoldBadge from '../../asset/image/Gold_Badge.png'
import FriendsView from '../../asset/image/Friend_View.png'

import CloseFriends from '../../asset/image/CloseFriend.png'

import { getToastsData } from '../../actions/ToastActions'

import _ from 'lodash'

import Carousel from 'react-native-snap-carousel' // Version can be specified in package.json
import {
    openProfile,
    openProfileDetailEditForm,
    refreshProfileData,
} from '../../actions'
import { connect } from 'react-redux'

import { scrollInterpolator, animatedStyles } from './animation'

import GetBronzeBadge from '../../components/GetBronzeBadge'
import { UI_SCALE } from '../../styles'
import InviteFriendModal from '../MeetTab/Modal/InviteFriendModal'
import * as underscore from 'underscore'
import { Actions } from 'react-native-router-flux'

const SLIDER_WIDTH = Dimensions.get('window').width
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.95)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 9)
const alternatingText = [
    // 'Your account has low activity. Invite more friends to get new suggestions, inspiration, and Likes! 🔥',

    'Bring new energy to old friendships by discovering the ambitions that drive each other. 🙌',

    'Make your friendships more authentic by crushing your goals together!',

    'Find out what your friends want in life and help them. 🤝',

    'Telling friends about your goals is a surefire way to get lit. Invite more friends to help you stay on track!',

    'Step up the excitement of reaching your goals by involving more friends in the process.',

    'After you get your Silver Badge, you’ll able to participate in other exciting Challenges!',

    'Sharing your goals helps you avoid procrastination and be more accountable.',

    'Having more friends on GoalMogul will motivate, encourage and help you stay focused!',

    'Gain access to 200+ more goal planning questions when get your Silver Badge!',

    'Unlock the ability to create your own Tribe by getting your Silver Badge!',
]

let pageAb = ''

class TestSwiper extends Component {
    constructor(props) {
        super(props)
        this._renderItem = this._renderItem.bind(this)
        this.heading = this.props.heading

        this.state = {
            index: 0,
            showInviteFriendModal: false,
            heading: '',
            refreshCarousal: false,

            toastsData: [
                {
                    _id: 1,
                    image: MissingProfile,
                    show: this.props.toastsData.showImageToast,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                        marginBottom: 8,
                        marginHorizontal: 10,
                    },
                    mainHeading: {
                        fontSize: UI_SCALE * 17,
                        title: 'Something’s missing…',
                        lineheight: 18,
                        marginTop: 10,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 16,
                        title: 'Add a profile photo so friends recognize you!',
                        lineheight: 19,
                    },
                    renderButton: true,
                    marginButtonTop: undefined,
                    thirdText: undefined,
                    buttonText: 'Edit Profile',

                    handleButtonPress: () =>
                        this.props.openProfileDetailEditForm(
                            this.props.userId,
                            pageAb
                        ),
                },

                {
                    _id: 2,
                    image: GreenBadge,
                    show: this.props.toastsData.showGreenBadge,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '60%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },
                    mainHeading: {
                        fontSize: UI_SCALE * 18,
                        title: `To earn your Green Badge, simply complete your Profile and add your 1st goal!`,
                        lineheight: 21,
                    },
                    smallHeading: undefined,
                    renderButton: true,
                    marginButtonTop: 10,
                    thirdText: undefined,
                    buttonText: 'Edit Profile',
                    handleButtonPress: () =>
                        this.props.openProfileDetailEditForm(
                            this.props.userId,
                            pageAb
                        ),
                },

                {
                    _id: 3,
                    image: GreenBadge,
                    show: this.props.toastsData.showGetGreenBadge,

                    mainHeadingView: {
                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },
                    mainHeading: {
                        fontSize: UI_SCALE * 18,
                        title: 'Get your Green Badge now',

                        lineHeight: 18,
                        marginTop: 20,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 17,
                        title: 'Simply create your first goal!',
                        lineHeight: 18,
                        marginTop: 10,
                    },
                    renderButton: false,
                    buttonStyle: undefined,
                    marginButtonTop: undefined,
                    thirdText: undefined,
                    buttonText: undefined,
                    handleButtonPress: undefined,
                },

                {
                    _id: 4,
                    image: BronzeBadge,
                    show: this.props.toastsData.showGetBronzeBadge,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },

                    mainHeading: {
                        fontSize: UI_SCALE * 16,
                        title:
                            'You’re 1 friend away from earning your Bronze Badge.',
                        lineheight: 18,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 15,
                        title:
                            'Invite friends so they can appreciate knowing your goals!',
                        lineheight: 17,
                    },
                    renderButton: true,
                    marginButtonTop: undefined,
                    thirdText: undefined,
                    buttonText: 'Invite your Friends',
                    handleButtonPress: () => this.openInviteFriendModal(),
                },
                {
                    _id: 5,
                    image: SilverBadge,
                    show: this.props.toastsData.showGetSilverBadge,

                    mainHeadingView: {
                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },

                    mainHeading: {
                        fontSize: UI_SCALE * 16,
                        title: '',
                        lineheight: 21,
                        marginTop: 2,
                    },
                    smallHeading: undefined,
                    renderButton: true,
                    thirdText: undefined,
                    marginButtonTop: 10,
                    buttonText: 'Invite your Friends',
                    handleButtonPress: () => this.openInviteFriendModal(),
                },

                {
                    _id: 6,
                    image: GoldBadge,
                    show: this.props.toastsData.showGetGoldBadge.toShow,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },

                    mainHeading: {
                        fontSize: UI_SCALE * 16,
                        title:
                            'You know what would look great next to your name?',
                        lineheight: 18,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 15,
                        title: 'The shining Gold Badge!',
                        lineheight: 17,
                    },
                    renderButton: false,
                    marginButtonTop: undefined,
                    thirdText:
                        'You only need 6 more friends with Bronze Badges to earn your Gold Badge.',
                    buttonText: undefined,
                    handleButtonPress: undefined,
                },

                {
                    _id: 7,
                    image: FriendsView,
                    show:
                        this.props.toastsData.friendsProfileToVisit.length > 0
                            ? true
                            : false,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },

                    mainHeading: {
                        fontSize: UI_SCALE * 16,
                        title: `You haven’t seen ${
                            this.props.friendsProfileToVisit.length == 0
                                ? null
                                : this.props.toastsData.friendsProfileToVisit[0]
                                      .name
                        }’s profile yet.`,
                        lineheight: 18,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 15,
                        title: 'How about leaving him a memorable comment?',
                        lineheight: 17,
                    },
                    renderButton: true,
                    marginButtonTop: undefined,
                    thirdText: undefined,
                    buttonText: 'View his profile',
                    handleButtonPress: () =>
                        this.props.openProfile(
                            this.props.toastsDatafriendsProfileToVisit[0]._id
                        ),
                },

                {
                    _id: 8,
                    image: CloseFriends,
                    show:
                        this.props.toastsData.closeFriendsToVisit.length > 0
                            ? true
                            : false,

                    mainHeadingView: {
                        justifyContent: 'space-between',

                        // alignItems: 'center',

                        flex: 1,
                        // flexWrap: 'wrap',
                        width: '65%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                        marginHorizontal: 10,
                    },

                    mainHeading: {
                        fontSize: UI_SCALE * 16,
                        title: `You haven’t checked out ${
                            this.props.toastsData.closeFriendsToVisit.length ==
                            0
                                ? null
                                : this.props.toastsData.closeFriendsToVisit[0]
                                      .name
                        }’s goals in while.`,
                        lineheight: 18,
                    },
                    smallHeading: {
                        fontSize: UI_SCALE * 15,
                        title:
                            'Leave a thoughtful comment to supercharge your friendship.',
                        lineheight: 17,
                    },
                    renderButton: true,
                    marginButtonTop: undefined,
                    thirdText: undefined,
                    buttonText: 'View his profile',
                    handleButtonPress: () =>
                        this.props.openProfile(
                            this.props.toastsData.closeFriendsToVisit[0]._id
                        ),
                },
            ],
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('PREVPROPSS', prevProps.toastsData)
        console.log('PREVPROPSS1', this.props.toastsData)
        console.log(
            'PREVPROPSS2',
            !_.isEqual(prevProps.toastsData, this.props.toastsData)
        )

        if (!_.isEqual(prevProps.toastsData, this.props.toastsData)) {
            this.setState({ toastsData: this.props.toastsData })
        }
        this.props.getToastsData()
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return (
    //         !_.isEqual(this.props, nextProps) ||
    //         !_.isEqual(this.state, nextState)
    //     )
    // }

    componentDidMount() {
        this.props.getToastsData()
        const dataToShow = this.state.toastsData.filter((item) => {
            if (item.show) {
                if (item._id == 5) {
                    const shuffledArray = underscore.shuffle(alternatingText)
                    item.mainHeading.title = shuffledArray[0]
                    return item
                }
                return item
            }
        })
        this.setState({ toastsData: dataToShow })
        const { userId } = this.props
        const pageId = this.props.refreshProfileData(userId)
        pageAb = pageId
    }

    openInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: true })
    }

    closeInviteFriendModal = () => {
        this.setState({ showInviteFriendModal: false })
    }

    _renderItem({ item }) {
        return <GetBronzeBadge item={item} />
    }

    render() {
        // console.log('THIS IS STATE OF SWIPER', this.state.toastsData)

        return (
            <View>
                <InviteFriendModal
                    isVisible={this.state.showInviteFriendModal}
                    closeModal={this.closeInviteFriendModal}
                />
                <Carousel
                    ref={(c) => (this.carousel = c)}
                    data={this.state.toastsData}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const { user, userId } = state.user
    const { profile } = user
    const { image } = profile

    const { data, loading, loadingMore, refreshing } = state.home.mastermind

    const { toastsData } = state.toasts

    const {
        friendsProfileToVisit,
        showImageToast,
        showGreenBadge,
        showGetGreenBadge,
        showGetBronzeBadge,
        showGetSilverBadge,
        showGetGoldBadge,
        closeFriendsToVisit,
    } = state.toasts.toastsData

    return {
        profile,
        userId,
        loading,
        image,
        friendsProfileToVisit,
        // showImageToast,
        // showGetBronzeBadge,
        // showGreenBadge,
        // showGetGoldBadge,
        // showGetSilverBadge,
        // showGetGreenBadge,
        // closeFriendsToVisit,
        toastsData,
    }
}

export default connect(mapStateToProps, {
    openProfileDetailEditForm,
    refreshProfileData,
    openProfile,
    getToastsData,
})(TestSwiper)

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 10,
        marginBottom: 10,
        right: 5,
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue',
    },
    itemLabel: {
        color: 'white',
        fontSize: 24,
    },
})
