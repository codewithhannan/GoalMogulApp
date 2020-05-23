import React from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { GM_CONTAINER_BACKGROUND, GM_BLUE } from '../../styles/basic/color';
import SearchBarHeader from '../Common/Header/SearchBarHeader';
import DelayedButton from '../Common/Button/DelayedButton';
import Icons from '../../asset/base64/Icons';
import { BUTTON_STYLE, GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';
import PYMKCard from './PYMKCard';

/**
 * Friend tab page for GM main tabs
 * 
 * @link https://www.figma.com/file/T1ZgWm5TKDA4gtBS5gSjtc/GoalMogul-App?node-id=24%3A195
 * 
 * props {
 *  requests: [], friend request list
 *  pymkData: [], people you may know list
 * 
 * }
 */
class FriendTab extends React.Component {

    handleSeeAllFriends = () => {
        Actions.friendTabView();
    }

    handleSeeAllRequests = () => {
        Actions.requestTabView();
    }

    /** Render top card for inviting friends */
    renderInviteFriendCard() {
        return (
            <View style={{ padding: styles.padding, flexDirection: "row", flex: 1, backgroundColor: "white", marginBottom: 8 }}>
                <View style={{ marginRight: 18, width: "56%" }}>
                    <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_4, fontFamily: GM_FONT_FAMILY.GOTHAM, marginBottom: styles.padding }}>
                        Great friends help each other achieve so much more!
                    </Text>
                    <DelayedButton onPress={() => console.log("Invite friends")} style={BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT.containerStyle}>
                        <Text style={BUTTON_STYLE.GM_BLUE_BG_WHITE_BOLD_TEXT.textStyle}>Invite your Friends</Text>
                    </DelayedButton>
                </View>
                <Image source={Icons.Delivery} style={{ width: 150 }}/>
            </View>
        );
    }

    /** Render friend request section */
    renderRequestCard = ({ item, index }) => {
        return null;
    }

    renderRequestEmptyCard = () => {
        return (
            <View style={{ width: "100%", minHeight: 120, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#F2F2F2" }}>
                <Image source={Icons.AccountMultiple} style={{ tintColor: "#E0E0E0", width: 40, height: 30 }} resizeMode="cover" />
                <Text style={{ fontSize: GM_FONT_SIZE.FONT_1, lineHeight: GM_FONT_LINE_HEIGHT.FONT_2, fontFamily: GM_FONT_FAMILY.GOTHAM, color: "#9B9B9B", marginTop: 16 }}>
                    There are currently no friend requests.
                </Text>
            </View>
        )
    }

    renderFriendRequests = () => {
        return (
            <View style={{ width: "100%", backgroundColor: "white" }}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: styles.padding }}>
                    <Text style={{ fontSize: GM_FONT_SIZE.FONT_3, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3_5, fontFamily: GM_FONT_FAMILY.GOTHAM_BOLD }}>
                        Friend Requests
                    </Text>
                    <View style={{ flex: 1 }} />
                    <DelayedButton onPress={() => this.handleSeeAllFriends()} style={{ flexDirection: "row" }}>
                        <Text style={{ color: GM_BLUE, fontSize: GM_FONT_SIZE.FONT_2, lineHeight: GM_FONT_LINE_HEIGHT.FONT_3, fontFamily: GM_FONT_FAMILY.GOTHAM, textDecorationLine: "underline" }}>
                            All My Friends
                        </Text>
                        <Image />
                    </DelayedButton>
                </View>
                {
                    !this.props.requests ? this.renderRequestEmptyCard() : null
                }
                {/* <FlatList 
                    data={this.props.requests}
                    renderItem={this.renderRequestCard}
                    ListEmptyComponent={this.renderRequestEmptyCard}
                    horizontal
                    contentContainerStyle={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#F2F2F2", width: "100%" }}
                /> */}
            </View>
        );
    }

    renderListHeader = () => {
        return (
            <View style={{ width: "100%", marginBottom: 8 }}>
                {this.renderInviteFriendCard()}
                {this.renderFriendRequests()}
            </View>
        )
    }

    /** Render people you may know card */
    renderPYMK = ({ item, index }) => {
        return <PYMKCard user={item} />;
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                <SearchBarHeader
                    backButton={false}
                    setting={false}
                    rightIcon='menu'
                />
                <FlatList 
                    data={this.props.pymkData || testData}
                    ListHeaderComponent={this.renderListHeader}
                    renderItem={this.renderPYMK}
                    contentContainerStyle={{ backgroundColor: GM_CONTAINER_BACKGROUND }}
                />
            </View>
        );
    }
}

const styles = {
    padding: 16,
    containerStyle: {
        backgroundColor: GM_CONTAINER_BACKGROUND,
        flex: 1
    },
    requestListContainerStyle: {
        width: "100%",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#F2F2F2"
    }
};

const testData = [{ 
    name: "Jay Patel",
    profile: {
        badges: {
            milestoneBadge: {
                currentMilestone: 1
            }
        }
    }, 
    topGoals: ["Run 100 miles within 1 day 24 hours 20 seconds 203 milliseconds so that this is a super long goal"]}]

const mapStateToProps = (state) => {
    return {

    };
}

export default connect(
    mapStateToProps,
    {

    }
)(FriendTab);