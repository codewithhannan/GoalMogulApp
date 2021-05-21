/**
 * Onboarding flow Sync Contact page.
 *
 * @see https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * @format
 */

import React from 'react'
import {
    View,
    Text,
    Dimensions,
    Image,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import OnboardingHeader from './Common/OnboardingHeader'

import OnboardingStyles, { getCardBottomOffset } from '../../styles/Onboarding'

import { text, default_style, color } from '../../styles/basic'

import { PRIVACY_POLICY_URL } from '../../Utils/Constants'
import { uploadContacts } from '../../redux/modules/registration/RegistrationActions'
import { REGISTRATION_SYNC_CONTACT_NOTES } from '../../redux/modules/registration/RegistrationReducers'
import DelayedButton from '../Common/Button/DelayedButton'
import SyncContactInfoModal from './SyncContactInfoModal'
import Icons from '../../asset/base64/Icons'
import {
    wrapAnalytics,
    SCREENS,
    trackWithProperties,
    EVENT as E,
} from '../../monitoring/segment'
import {
    handleRefreshOnBoarding,
    handleRefresh,
    meetOnLoadMoreOnboarding,
} from '../../actions'
import PYMKCard from '../MeetTab/PYMKCard'
import { FONT_FAMILY } from '../../styles/basic/text'
import { api, api as API } from '../../redux/middleware/api'
import { ActivityIndicator } from 'react-native-paper'

const screenWidth = Math.round(Dimensions.get('window').width)
const { button: buttonStyle, text: textStyle } = OnboardingStyles

class OnboardingPeopleKnow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            syncContactInfoModalVisible: false,
            loading: true, // test loading param
            errMessage: undefined,
            pymkData: [],
            skip: 0,
            limit: 10,
            pymkLoading: true,
        }
    }

    openModal = () =>
        this.setState({
            ...this.state,

            errMessage: undefined,
            loading: true,
        })

    componentDidMount() {
        // Refresh recommended users with force refresh
        this.fetchUsers()
        this.props.handleRefresh('suggested', true)
    }

    fetchUsers = async () => {
        const { skip, limit, pymkData } = this.state

        try {
            const res = await API.get(
                `secure/user/friendship/inviter-friends?limit=${limit}&skip=${skip}`,
                this.props.token
            )

            this.setState({
                pymkData: pymkData.concat(res.data),
                skip: skip + 10,
                limit: limit,
                pymkLoading: false,
            })
        } catch (error) {
            console.log('ERROR', error)
        }
    }

    onNotNow = () => {
        trackWithProperties(E.REG_CONTACT_SYNC_SKIP, {
            UserId: this.props.userId,
        })
        const screenTransitionCallback = () => {
            Actions.push('registration_community_guideline')
        }
        screenTransitionCallback()
    }

    renderPYMK = ({ item, index }) => {
        return <PYMKCard user={item} index={index} hideOptions />
    }

    renderItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: '#F2F2F2' }} />
    }

    renderPymkHeader = () => {
        return (
            <View
                style={{
                    width: '100%',
                    backgroundColor: 'white',
                    marginBottom: 8,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: styles.padding,
                    }}
                >
                    <Text style={[default_style.titleText_1]}>
                        People you May Know
                    </Text>
                    <View style={{ flex: 1 }} />
                    <DelayedButton
                        onPress={() =>
                            Actions.push('registration_contact_sync')
                        }
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                        activeOpacity={1}
                    >
                        <Text
                            style={[
                                default_style.titleText_2,
                                {
                                    color: color.GM_BLUE,
                                    fontFamily: FONT_FAMILY.SEMI_BOLD,
                                },
                            ]}
                        >
                            Sync Contacts
                        </Text>
                    </DelayedButton>
                </View>
                <View
                    style={{
                        height: 2,
                        backgroundColor: '#F2F2F2',
                        marginTop: 10,
                    }}
                />
            </View>
        )
    }

    renderListHeader = () => {
        return <View style={{ width: '100%' }}>{this.renderPymkHeader()}</View>
    }

    renderButtons() {
        return (
            <View style={{ width: '100%', justifyContent: 'center' }}>
                <TouchableOpacity style={{}} onPress={this.onNotNow}>
                    <View
                        style={{
                            backgroundColor: '#42C0F5',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            borderColor: '#42C0F5',
                            borderWidth: 2,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: 'white',
                                fontWeight: '500',
                                fontSize: 15,
                                fontStyle: 'SFProDisplay-Regular',
                            }}
                        >
                            Continue
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * Render image impression for sync contact
     */

    render() {
        return (
            <View
                style={[
                    OnboardingStyles.container.page,
                    { paddingBottom: getCardBottomOffset() },
                ]}
            >
                <OnboardingHeader />
                {this.state.pymkLoading ? (
                    <ActivityIndicator
                        size="medium"
                        color="#42C0F5"
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />
                ) : (
                    <View style={[OnboardingStyles.container.card]}>
                        <View
                            style={{
                                flexGrow: 1,

                                width: '100%',
                            }}
                        >
                            <View style={{ flex: 1, height: '100%' }}>
                                <FlatList
                                    keyExtractor={(item) => item._id}
                                    data={this.state.pymkData}
                                    ListHeaderComponent={this.renderListHeader}
                                    renderItem={this.renderPYMK}
                                    // loading={this.props.loading}
                                    // onEndReached={this.fetchUsers}
                                    ItemSeparatorComponent={
                                        this.renderItemSeparator
                                    }
                                />
                            </View>
                        </View>
                        {this.renderButtons()}
                    </View>
                )}
                <SyncContactInfoModal
                    isOpen={this.state.syncContactInfoModalVisible}
                    loading={this.state.loading}
                    errMessage={this.state.errMessage}
                    onSyncContact={this.onSyncContact} // Retry upload contacts
                    onNotNow={this.onModalNotNow}
                    onInvite={this.onModalInvite}
                    onCancel={this.closeModal}
                />
            </View>
        )
    }
}

const styles = {
    noteTextStyle: {
        fontSize: text.TEXT_FONT_SIZE.FONT_1,
        lineHeight: text.TEXT_LINE_HEIGHT.FONT_3_5,
        fontFamily: text.FONT_FAMILY.REGULAR,
        color: '#333333',
        alignSelf: 'flex-end',
        marginTop: 8,
        textAlign: 'center',
    },
}

const testData = [
    {
        name: 'Jay Patel',
        profile: {
            badges: {
                milestoneBadge: {
                    currentMilestone: 1,
                },
            },
        },
        topGoals: [
            'Run 100 miles within 1 day 24 hours 20 seconds 203 milliseconds so that this is a super long goal',
        ],
    },
]

const mapStateToProps = (state) => {
    const { userId, token } = state.user
    const { suggested } = state.meet
    const { data, loading } = suggested
    return { userId, pymkData: data, loading, token }
}

const AnalyticsWrapper = wrapAnalytics(
    OnboardingPeopleKnow,
    SCREENS.REG_CONTACTY_SYNC
)

export default connect(mapStateToProps, {
    uploadContacts,
    meetOnLoadMoreOnboarding,
    handleRefresh,
    handleRefreshOnBoarding,
})(AnalyticsWrapper)
