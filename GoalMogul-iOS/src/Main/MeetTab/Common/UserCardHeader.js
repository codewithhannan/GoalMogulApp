import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { FONT_FAMILY_1, DEFAULT_STYLE } from '../../../styles';
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import { UserBanner } from '../../../actions';
import Icons from '../../../asset/base64/Icons';
import ProfileImage from '../../Common/ProfileImage';
import Name from '../../Common/Name';

class UserCardHeader extends React.PureComponent {

    renderHeader(item) {
        const { name, profile, headline, mutualFriendCount } = item;
        if (!profile) {
            // TODO: add sentry error logging
            return null;
        }
        const detailText = headline || profile.occupation;
        
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ProfileImage
                    imageStyle={{ height: 40, width: 40, borderRadius: 20 }}
                    defaultImageStyle={{ width: 20, height: 20, margin: 20 }}
                    imageUrl={profile ? profile.image : Icons.Account}
                    imageContainerStyle={styles.imageContainerStyle}
                    userId={item._id}
                />
                <View style={{ marginLeft: 7 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Name text={name} textStyle={{
                            fontSize: 15,
                            fontFamily: FONT_FAMILY_1,
                            fontWeight: 'bold',
                            color: '#4F4F4F',
                        }} />
                        <UserBanner
                            user={item}
                            iconStyle={{ marginLeft: 7, height: 18, width: 15 }}
                        />
                        <Text 
                            style={styles.infoTextStyle}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                        >
                            {detailText}
                        </Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
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
            <View style={styles.containerStyle}>
                {this.renderHeader(user)}
            </View>
        )
    }
}

const styles = {
    containerStyle: {
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
        marginLeft: 7
    },
}

export default UserCardHeader;