import React from 'react';
import {
    View,
    Text,
    Dimensions,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { FONT_FAMILY_1, DEFAULT_STYLE, GM_BLUE } from '../../../styles';
import DelayedButton from '../../Common/Button/DelayedButton';
import { openProfileDetail } from '../../../actions';
import { IMAGE_BASE_URL } from '../../../Utils/Constants';
import Icons from '../../../asset/base64/Icons';

/**
 * Component that display condensed request info in FriendTab
 * Design: https://www.figma.com/file/pbqMYdES3eWbz6bxlrIFP4/Friends?node-id=69%3A460
 */
class RequestCard extends React.PureComponent {

    handleAcceptOnPress = () => {

    }

    handleOpenProfile = (userId) => {
        this.props.openProfileDetail(userId);
    }

    getCardWidth = (parentPadding) => {
        const { width } = Dimensions.get("window");
        return ((width - parentPadding * 2) - parentPadding * 1.3) / 2;
    }

    getDetailText = (user) => {
        const { name, profile, headline } = user;
        let detailText;
        if (headline) return headline;
        if (profile && profile.occupation) return profile.occupation;
        return undefined;
    }

    renderProfileImage(user) {
        const { profile } = user;
        let source = Icons.Account;
        const hasProfileImage = profile && profile.image;
        if (hasProfileImage) {
            source = { uri: `${IMAGE_BASE_URL}${profile.image}` };
        }

        return (
            <View style={{  height: 52, width: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "lightgray", marginBottom: 8  }}>
                <Image source={source} style={[{ height: 50, width: 50, borderRadius: 25 }, { marginBottom: hasProfileImage ? 0 : 3 }]} resizeMode="cover" />
            </View>
        )
    }

    render() {
        const { user } = this.props;
        if (!user) return null;
        const cardWidth = this.getCardWidth(styles.parentPadding);
        const detailText = this.getDetailText(user);
        const { name, mutualFriendCount } = user;

        // TODO: accept / view profile

        return (
            <DelayedButton style={[styles.containerStyle, { width: cardWidth }]} onPress={() => this.handleOpenProfile(user._id)} activeOpacity={0.9}>
                {this.renderProfileImage(user)}
                <Text numberOfLines={1} style={[DEFAULT_STYLE.titleText_2]}>{name}</Text>
                <Text numberOfLines={1} style={[DEFAULT_STYLE.smallText_1, { opacity: detailText ? 1 : 0, color: "#9B9B9B" }]}>{detailText}</Text>
                <Text numberOfLines={1} style={[DEFAULT_STYLE.smallText_1, { color: "#555" }]}>
                    <Text></Text>mutual {mutualFriendCount > 1 ? "friends" : "friend"}
                </Text>
                <DelayedButton onPress={this.handleAcceptOnPress} style={{ borderRadius: 3, borderColor: GM_BLUE, borderWidth: 1, width: "100%", alignItems: "center", padding: 8, marginTop: 10 }}>
                    <Text style={[DEFAULT_STYLE.buttonText_1, { color: GM_BLUE }]}>Accept</Text>
                </DelayedButton>
            </DelayedButton>
        );
    }
}

const styles = {
    parentPadding: 16,
    containerStyle: {
        padding: 11,
        borderWidth: 1,
        borderColor: "#F2F2F2",
        borderRadius: 3,
        alignItems: "center"
    }
}

export default connect(
    null,
    {
        openProfileDetail
    }
)(RequestCard);