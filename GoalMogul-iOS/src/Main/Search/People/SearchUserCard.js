import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import badge from '../../../asset/utils/badge.png';
import next from '../../../asset/utils/next.png';

// Actions
import { updateFriendship, openProfile } from '../../../actions';
import DelayedButton from '../../Common/Button/DelayedButton';

const DEBUG_KEY = '[ Component SearchUserCard ]';

class SearchUserCard extends Component {

  state = {
    imageLoading: false
  }

  onButtonClicked = (_id) => {
    console.log(`${DEBUG_KEY} open profile with id: `, _id);
    if (this.props.onSelect && this.props.onSelect instanceof Function) {
      return this.props.onSelect(_id, this.props.item);
    }
    this.props.openProfile(_id);
  }

  renderProfileImage() {
    const { image } = this.props.item.profile;
    let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (image) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage =
      (
        <View>
          <Image
            onLoadStart={() => this.setState({ imageLoading: true })}
            onLoadEnd={() => this.setState({ imageLoading: false })}
            style={styles.imageStyle}
            source={{ uri: imageUrl }}
          />
          {
            this.state.imageLoading ?
            <View style={{ ...styles.imageStyle, alignItems: 'center', justifyContent: 'center' }}>
               <ActivityIndicator size="large" color="lightgray" />
            </View>
            : null
          }
        </View>

      );
    }
    return profileImage;
  }

  renderButton(_id) {
    const { cardIconSource, cardIconStyle } = this.props;
    const iconSource = cardIconSource || next;
    const iconStyle = { ...styles.iconStyle, opacity: 0.8, ...cardIconStyle };
    return (
      <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={this.onButtonClicked.bind(this, _id)}
          style={{ padding: 15 }}
        >
          <Image
            source={iconSource}
            style={iconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <Name text={name} textStyle={{ color: '#4F4F4F' }} />
      </View>
    );
  }

  renderOccupation() {
    const { profile } = this.props.item;
    if (profile.occupation) {
      return (
        <View
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          <Text style={styles.detailTextStyle}>{profile.occupation}</Text>
        </View>
      );
    }
  }

  render() {
    const { _id } = this.props.item;
    let { cardContainerStyles } = this.props;
    if (!cardContainerStyles) {
      cardContainerStyles = {};
    };
    return (
      <DelayedButton activeOpacity={0.6} onPress={this.onButtonClicked.bind(this, _id)}>
        <View style={{...styles.containerStyle, ...cardContainerStyles}}>
          {this.renderProfileImage()}

          <View style={styles.bodyContainerStyle}>
            {this.renderInfo()}
            {this.renderOccupation()}
          </View>
          {/* {this.renderButton(_id)} */}
        </View>
      </DelayedButton>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 4,
    marginRight: 4,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    height: 25,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  titleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#9B9B9B',
    paddingLeft: 3,
    fontFamily: 'gotham-pro',
  },
  iconContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#17B3EC'
  }
};

export default connect(null, {
  updateFriendship,
  openProfile
})(SearchUserCard);
