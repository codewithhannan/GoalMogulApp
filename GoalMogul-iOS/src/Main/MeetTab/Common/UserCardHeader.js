import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { FONT_FAMILY_1, DEFAULT_STYLE } from '../../../styles';
import { UserBanner, openProfileDetail } from '../../../actions';
import Icons from '../../../asset/base64/Icons';
import ProfileImage from '../../Common/ProfileImage';
import Name from '../../Common/Name';
import DelayedButton from '../../Common/Button/DelayedButton';

class UserCardHeader extends React.PureComponent {

    handleOpenProfile = () => {
        this.props.openProfileDetail(this.props.user._id)
    }

    renderHeader(item) {
        const { name, profile, headline, mutualFriendCount } = item;
        if (!profile) {
            // TODO: add sentry error logging
            return null;
        }
        const detailText = headline || profile.occupation;
        
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <ProfileImage
                    imageUrl={profile ? profile.image : undefined}
                    userId={item._id}
                />
                <View style={{ marginLeft: 7, flex: 1 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <Name text={name} textStyle={DEFAULT_STYLE.titleText_2} />
                        <UserBanner
                            user={item}
                            iconStyle={{ marginLeft: 5, height: 18, width: 15 }}
                        />
                        <View style={{ flexDirection: "row", flex: 1, flexWrap: "wrap" }}>
                            <Text 
                                style={styles.infoTextStyle}
                                numberOfLines={1}
                                ellipsizeMode='tail'
                            >
                                {detailText}
                            </Text>
                        </View>
                        
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, flex: 1 }}>
                        <View style={{ height: 14, width: 14, marginRight: 4, marginBottom: 2 }}>
                            <Image source={Icons.Connection} style={{ flex: 1, tintColor: "#777777" }} resizeMode="contain" resizeMethod="scale" />
                        </View>
                        <Text style={[DEFAULT_STYLE.smallText_1, { color: "#555555" }]}>
                            <Text style={{ fontWeight: "bold" }}>{`${mutualFriendCount} `}</Text>
                                {mutualFriendCount && mutualFriendCount > 1 ? "friends" : "friend"} in common
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        const { user } = this.props;
        if (!user) {
            return null;
        }
        return (
            <DelayedButton style={styles.containerStyle} activeOpacity={0.9} onPress={this.handleOpenProfile}>
                {this.renderHeader(user)}
            </DelayedButton>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 30,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
    infoTextStyle: {
        color: '#9B9B9B',
        fontSize: 11,
        fontFamily: FONT_FAMILY_1,
        marginLeft: 5
    },
}

export default connect(
    null,
    {
        openProfileDetail
    }
)(UserCardHeader);