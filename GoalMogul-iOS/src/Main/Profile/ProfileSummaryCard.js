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
import { openProfileDetail } from '../../actions';

/* Components */
import Name from '../Common/Name';
import Position from '../Common/Position';
import Stats from '../Common/Text/Stats';

const DEBUG_KEY = '[ Component ProfileSummaryCard ]';

class ProfileSummaryCard extends Component {
  state = {
    requested: false,
    imageLoading: false
  }

  onButtonClicked = (_id) => {
    console.log(`${DEBUG_KEY} open profile detail for id: ${_id}`);
    this.props.openProfileDetail();
  }

  handleOpenProfileDetail() {
    // this.props.openProfileDetail();
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
          style={styles.iconStyle}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const { name, headline } = this.props.user;
    let imageUrl = this.props.user.profile.image;
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
        (<Image
          onLoadStart={() => this.setState({ imageLoading: true })}
          onLoadEnd={() => this.setState({ imageLoading: false })}
          style={styles.imageStyle}
          source={{ uri: imageUrl }}
        />);
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
    //         color='#45C9F6'
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
              <Name text={name} textStyle={{ fontSize: 18 }} />
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
    borderColor: '#45C9F6',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#45C9F6',
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
    tintColor: '#45C9F6'
  }
};

const mapStateToProps = state => {
  const { userId, user, mutualFriends, loading } = state.profile;
  const friendsCount = state.meet.friends.count;
  const isSelf = state.profile.userId.toString() === state.user.userId.toString();

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
