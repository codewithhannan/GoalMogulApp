import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

/* Assets */
import next from '../../asset/utils/next.png';
import defaultUserProfile from '../../asset/utils/defaultUserProfile.png';

/* Actions */
import { openProfileDetail, UserBanner } from '../../actions';

/* Components */
import Name from '../Common/Name';
import Position from '../Common/Position';
import Stats from '../Common/Text/Stats';

// Selector
import {
  getUserDataByPageId,
  getUserData
} from '../../redux/modules/User/Selector';

const DEBUG_KEY = '[ Component ProfileSummaryCard ]';

class ProfileSummaryCard extends Component {
  state = {
    requested: false,
    imageLoading: false
  }

  onButtonClicked = (_id) => {
    console.log(`${DEBUG_KEY} open profile detail for id: ${_id}`);
    this.props.openProfileDetail(this.props.userId, this.props.pageId);
  }

  handleOpenProfileDetail() {
    this.props.openProfileDetail(this.props.userId, this.props.pageId);
  }

  renderStats() {
    const data = this.props.isSelf ?
      [{ name: 'Friends', stat: 0 || this.props.friendsCount }] :
      [{ name: 'Mutual Friends', stat: 0 || this.props.mutualFriends.count }];
    return <Stats data={data} />;
  }

  renderButton(_id) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={this.onButtonClicked.bind(this, _id)}
        style={{
          padding: 20,
          paddingTop: 10,
          paddingBottom: 10,
          borderLeftWidth: 1,
          borderColor: '#efefef'
        }}
      >
        <Image
          source={next}
          style={{ ...styles.iconStyle, opacity: 0.8 }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { user } = this.props;
    if (!user) return null;

    const { name, headline, profile } = user;
    let imageUrl = profile.image;
    // let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    let profileImage = (!this.props.loading & !imageUrl) ?
    (<Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />)
    :
    (
      <View style={{ ...styles.imageStyle, alignItems: 'center', justifyContent: 'center' }}>
         <ActivityIndicator size="large" color="lightgray" />
      </View>
    );

    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage =
        (
          <View style={styles.imageContainerStyle}>
            <Image
              onLoadStart={() => this.setState({ imageLoading: true })}
              onLoadEnd={() => this.setState({ imageLoading: false })}
              style={styles.imageStyle}
              source={{ uri: imageUrl }}
            />
          </View>
        );
    }
    // Style 1:
    // const addFriendButton = !this.props.isSelf ? (
    //   <Button
    //     title='Friend'
    //     titleStyle={styles.buttonTextStyle}
    //     clear
    //     icon={
    //       <Icon
    //         type='octicon'
    //         name='plus-small'
    //         width={10}
    //         size={21}
    //         color='#17B3EC'
    //         iconStyle={styles.buttonIconStyle}
    //       />
    //     }
    //     iconLeft
    //     buttonStyle={styles.buttonStyle}
    //   />
    // ) : '';

    return (
      <TouchableWithoutFeedback onPress={this.handleOpenProfileDetail.bind(this)}>
        <View style={styles.containerStyle}>
          <View style={{ flex: 5, flexDirection: 'row' }}>
            {profileImage}

            <View style={styles.bodyStyle}>
              <View style={{ flexDirection: 'row' }}>
                <Name text={name} textStyle={{ fontSize: 18 }} />
                <UserBanner user={user} iconStyle={{ height: 17, width: 13 }} />
              </View>

              <Position text={headline} />
              {this.renderStats()}
            </View>
          </View>
          <View style={styles.buttonContainerStyle}>
            {this.renderButton(this.props.userId)}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 70
  },
  bodyStyle: {
    flex: 3,
    display: 'flex',
    marginLeft: 10,
    marginRight: 5,
    justifyContent: 'space-between'
  },
  buttonContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5
  },
  buttonStyle: {
    width: 80,
    height: 26,
    borderWidth: 1,
    borderColor: '#17B3EC',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#17B3EC',
    fontSize: 13,
    fontWeight: '700',
    padding: 0,
    alignSelf: 'center'
  },
  buttonIconStyle: {
    marginTop: 2,
  },
  iconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#17B3EC'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  }
};

const mapStateToProps = (state, props) => {
  const { userId, pageId } = props;

  const userObject = getUserData(state, userId, '');
  const { user, mutualFriends } = userObject;

  const loading = getUserDataByPageId(state, userId, pageId, 'loading');

  const friendsCount = state.meet.friends.count;
  const isSelf = userId.toString() === state.user.userId.toString();

  return {
    userId,
    user,
    isSelf,
    mutualFriends,
    friendsCount,
    loading
  };
};

export default connect(mapStateToProps, { openProfileDetail })(ProfileSummaryCard);
