import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';

// Assets
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';

// Components
import ProgressBar from '../Common/ProgressBar';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';


class GoalDetailSection extends Component {

  // user basic information
  renderUserDetail() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={defaultProfilePic} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline name='John Doe' category='Personal Development' />
          <Timestamp time='5 mins ago' />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              Establish a LMFBR near Westport, Connecticut by the year 2020
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderCardContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <ProgressBar startTime='Mar 2013' endTime='Nov 2011' />
      </View>
    );
  }

  renderActionButtons() {
    return (
      <ActionButtonGroup>
        <ActionButton
          iconSource={LoveIcon}
          count={22}
          iconContainerStyle={{ backgroundColor: '#f9d6c9' }}
          iconStyle={{ tintColor: '#f15860' }}
          onPress={() => console.log('like')}
        />
        <ActionButton
          iconSource={ShareIcon}
          count={5}
          iconStyle={{ tintColor: '#a8e1a0', height: 32, width: 32 }}
          onPress={() => console.log('share')}
        />
        <ActionButton
          iconSource={BulbIcon}
          count={45}
          iconStyle={{ tintColor: '#f5eb6f', height: 26, width: 26 }}
          onPress={() => console.log('suggest')}
        />
      </ActionButtonGroup>
    );
  }

  render() {
    return (
      <View>
        <View style={{ ...styles.containerStyle }}>
          <View style={{ marginTop: 20, marginBottom: 10, marginRight: 15, marginLeft: 15 }}>
            {this.renderUserDetail()}
            {this.renderCardContent()}
          </View>
        </View>

        <View style={styles.containerStyle}>
          {this.renderActionButtons()}
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white',
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  }
};

export default GoalDetailSection;
