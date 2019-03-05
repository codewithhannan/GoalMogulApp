/**
 * This is currently used in the DiscoverTabView for friend discovery
 */
import React, { Component } from 'react';
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

// Assets
// import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import next from '../../../asset/utils/next.png';

// Styles
import {
  cardBoxShadow
} from '../../../styles';

// Actions
import { updateFriendship, openProfile } from '../../../actions';

const FRIENDSHIP_BUTTONS = ['Withdraw request', 'Cancel'];
const WITHDRAW_INDEX = 0;
const CANCEL_INDEX = 1;
const TAB_KEY = 'suggested';
const DEBUG_KEY = '[ Component SearchUserCard ]';

class SuggestedCard extends Component {
  state = {
    requested: false,
    accpeted: false
  }

  onButtonClicked = (_id) => {
    console.log(`${DEBUG_KEY} open profile with id: `, _id);
    this.props.openProfile(_id);
    // if (this.state.requested) {
    //   ActionSheetIOS.showActionSheetWithOptions({
    //     options: FRIENDSHIP_BUTTONS,
    //     cancelButtonIndex: CANCEL_INDEX,
    //   },
    //   (buttonIndex) => {
    //     console.log('button clicked', FRIENDSHIP_BUTTONS[buttonIndex]);
    //     switch (buttonIndex) {
    //       case WITHDRAW_INDEX:
    //         this.props.updateFriendship(_id, '', 'deleteFriend', TAB_KEY, () => {
    //           this.setState({ requested: false });
    //         });
    //         break;
    //       default:
    //         return;
    //     }
    //   });
    // }
    // return this.props.updateFriendship(_id, '', 'requesteFriend', TAB_KEY, () => {
    //   this.setState({ requested: true });
    // });
  }

  renderProfileImage(item) {
    const { profile, _id } = item;
    const { image } = profile;
    // let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    // if (image) {
    //   const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
    //   profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    // }
    // return profileImage;

    return (
      <ProfileImage
        imageStyle={{ height: 60, width: 60, borderRadius: 5 }}
        imageUrl={image}
        imageContainerStyle={styles.imageContainerStyle}
        userId={_id}
      />
    );
  }

  renderButton(_id) {
    return (
      <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={this.onButtonClicked.bind(this, _id)}
          style={{ padding: 15 }}
        >
          <Image
            source={next}
            style={{ ...styles.iconStyle, opacity: 0.8 }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // renderButton(_id) {
  //   if (this.state.requested) {
  //     return (
  //       <Button
  //         title='Sent'
  //         titleStyle={styles.buttonTextStyle}
  //         clear
  //         buttonStyle={styles.buttonStyle}
  //       />
  //     );
  //   }
  //   return (
  //     <Button
  //       title='Friend'
  //       titleStyle={styles.buttonTextStyle}
  //       clear
  //       icon={
  //         <Icon
  //           type='octicon'
  //           name='plus-small'
  //           width={10}
  //           size={20}
  //           color='#17B3EC'
  //           iconStyle={styles.buttonIconStyle}
  //         />
  //       }
  //       iconLeft
  //       buttonStyle={styles.buttonStyle}
  //       onPress={this.onButtonClicked.bind(this, _id)}
  //     />
  //   );
  // }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, flexDirection: 'row', marginRight: 6, alignItems: 'center' }}>
          <Name text={name} />
        </View>
      </View>
    );
  }

  renderUserInfo(item) {
    const { topGoals, topNeeds } = item;

    let topGoalText = 'None shared';
    if (topGoals !== null && topGoals !== undefined && topGoals.length !== 0) {
      topGoalText = '';
      topGoals.forEach((g, index) => {
        if (index !== 0) {
          topGoalText = `${topGoalText}, ${g}`; 
        } else {
          topGoalText = `${g}`; 
        }
      });
    }

    let topNeedText = 'None shared';
    if (topNeeds !== null && topNeeds !== undefined && topNeeds.length !== 0) {
      topNeedText = '';
      topNeeds.forEach((n, index) => {
        if (index !== 0) {
          topNeedText = `${topNeedText}, ${n}`; 
        } else {
          topNeedText = `${n}`; 
        }
      });
    }

    return (
      <View style={styles.infoContainerStyle}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginBottom: 2 }}>
            <Text style={styles.subTitleTextStyle}>Goals: </Text>
            <Text style={styles.bodyTextStyle}>{topGoalText}</Text>
          </Text>
          <Text numberOfLines={1} ellipsizeMode='tail'>
            <Text style={styles.subTitleTextStyle}>Needs: </Text>
            <Text style={styles.bodyTextStyle}>{topNeedText}</Text>
          </Text>
        </View>
      </View>
    );
  }

  renderOccupation() {
    const { profile } = this.props.item;
    if (profile.occupation) {
      return (
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          <Text style={styles.detailTextStyle}>{profile.occupation}</Text>
        </Text>
      );
    }
    return '';
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    const { headline, _id } = item;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={[styles.containerStyle, cardBoxShadow]}
        onPress={() => this.props.openProfile(_id)}
      >
        {this.renderProfileImage(item)}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderUserInfo(item)}
        </View>

        {this.renderButton(_id)}

        {/*
          <View style={styles.buttonContainerStyle}>
            {this.renderButton(_id)}
          </View>
        */}

      </TouchableOpacity>
    );
  }
}

// This was original implementation
// {this.renderOccupation()}
// <Text
//   style={{ ...styles.jobTitleTextStyle, fontWeight: '600' }}
//   numberOfLines={1}
//   ellipsizeMode='tail'
// >
//   {headline}
// </Text>

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1.5,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'white'
  },
  bodyContainerStyle: {
    marginLeft: 10,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    flex: 1
  },
  subTitleTextStyle: {
    color: '#17B3EC',
    fontSize: 12,
    fontWeight: '600'
  },
  bodyTextStyle: {
    fontSize: 12,
    color: '#9B9B9B'
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  buttonContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonStyle: {
    width: 70,
    height: 26,
    borderWidth: 1,
    borderColor: '#17B3EC',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    fontWeight: '700',
    paddingLeft: 1,
    padding: 0,
    alignSelf: 'center'
  },
  buttonIconStyle: {
    marginTop: 1
  },
  needContainerStyle: {

  },
  titleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
  friendTextStyle: {
    paddingLeft: 10,
    color: '#17B3EC',
    fontSize: 9,
    fontWeight: '800',
    maxWidth: 120
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
})(SuggestedCard);
