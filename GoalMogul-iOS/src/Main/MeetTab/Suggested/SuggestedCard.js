import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import next from '../../../asset/utils/next.png';

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

  renderProfileImage() {
    const { image } = this.props.item.profile;
    let profileImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (image) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${image}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    return profileImage;
  }

  renderButton(_id) {
    return (
      <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          onPress={this.onButtonClicked.bind(this, _id)}
          style={{ padding: 15 }}
        >
          <Image
            source={next}
            style={styles.iconStyle}
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
  //           color='#46C8F5'
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
      <View style={styles.containerStyle}>
        {this.renderProfileImage()}

        <View style={styles.bodyContainerStyle}>
          {this.renderInfo()}
          {this.renderOccupation()}
          <Text
            style={styles.jobTitleTextStyle}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {headline}
          </Text>
        </View>

        {this.renderButton(_id)}

        {/*
          <View style={styles.buttonContainerStyle}>
            {this.renderButton(_id)}
          </View>
        */}

      </View>
    );
  }
}

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
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    flex: 1
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
    borderColor: '#46C8F5',
    borderRadius: 13,
  },
  buttonTextStyle: {
    color: '#46C8F5',
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
    color: '#46C8F5',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#000000',
    paddingLeft: 3
  },
  jobTitleTextStyle: {
    color: '#46C8F5',
    fontSize: 11,
    fontWeight: '800',
    paddingTop: 5,
    paddingBottom: 3
  },
  friendTextStyle: {
    paddingLeft: 10,
    color: '#46C8F5',
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
    tintColor: '#46C8F5'
  }
};

export default connect(null, {
  updateFriendship,
  openProfile
})(SuggestedCard);
