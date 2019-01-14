/**
 * This View is the Friend Card View
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';
import ProfileImage from '../../Common/ProfileImage';

/* Assets */
import next from '../../../asset/utils/next.png';

/* Actions */
import {
  updateFriendship,
  blockUser,
  openProfile,
  UserBanner
} from '../../../actions';

class FriendRequestCardView extends React.PureComponent {
  state = {
    requested: false,
    accpeted: false
  }

  handleOnOpenProfile = () => {
    const { _id } = this.props.item;
    if (_id) {
      return this.props.openProfile(_id);
    }
  }

  renderProfileImage(item) {
    return (
        <ProfileImage
          imageStyle={{ height: 40, width: 40, borderRadius: 5 }}
          imageContainerStyle={{ marginTop: 5 }}
          imageUrl={item && item.profile ? item.profile.image : undefined}
          imageContainerStyle={styles.imageContainerStyle}
          userId={item._id}
        />
    );
  }

  renderButton(item) {
    return (
        <TouchableOpacity 
            onPress={() => this.props.openProfile(item._id)}
            activeOpacity={0.85}
            style={styles.nextButtonContainerStyle}
        >
            <Image
                source={next}
                style={{ ...styles.nextIconStyle, opacity: 0.8 }}
            />

        </TouchableOpacity>
    );
  }

  renderProfile(item) {
    const { name, profile, headline } = item;
    const detailText = headline || profile.occupation;
    return (
        <View style={{ flex: 1, marginLeft: 13 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Name text={name} />
                <UserBanner 
                    user={item} 
                    iconStyle={{ marginTop: 1, marginLeft: 7, height: 18, width: 15 }} 
                />
            </View>
            <View style={{ flexWrap: 'wrap', marginTop: 4 }}>
                <Text 
                    style={styles.infoTextStyle}
                    numberOfLines={2}
                    ellipsizeMode='tail'
                >
                    {detailText}
                </Text>
            </View>
            
        </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View style={[styles.containerStyle, styles.shadow]}>
        {this.renderProfileImage(item)}
        {this.renderProfile(item)}
        <View style={{ borderLeftWidth: 1, borderColor: '#efefef', height: 35 }} />
        {this.renderButton(item)}
      </View>
    );
  }
}

const styles = {
    containerStyle: {
        flexDirection: 'row',
        paddingLeft: 13,
        paddingTop: 8,
        paddingBottom: 8,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    // Button styles
    nextButtonContainerStyle: {
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextIconStyle: {
        height: 25,
        width: 26,
        transform: [{ rotateY: '180deg' }],
        tintColor: '#17B3EC'
    },
    // ProfileImage
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
    infoTextStyle: {
        color: '#9c9c9c',
        fontSize: 11
    },
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
};

export default connect(null, {
  updateFriendship,
  blockUser,
  openProfile
})(FriendRequestCardView);
