import React, { Component } from 'react';
import {
  View,
  Image,
  Text
} from 'react-native';
import { connect } from 'react-redux';

// Component
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LikeIcon from '../../../asset/utils/like.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/share.png';

class GoalCard extends Component {

  // card central content
  renderCardContent() {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }

  // user basic information
  renderUserDetail() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={defaultProfilePic} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <View style={{ marginLeft: 10 }}>
          <Headline name='John Doe' category='Personal Development' />
          <Timestamp time='5 mins ago' />
          <Text>
            Establish a LMFBR near Westport. Connecticut by the year 2020
          </Text>
        </View>
      </View>
    );
  }

  renderActionButtons() {
    return (
      <ActionButtonGroup>
        <ActionButton iconSoure={LikeIcon} count={22} onPress={() => console.log('like')} />
        <ActionButton iconSoure={ShareIcon} count={5} onPress={() => console.log('share')} />
        <ActionButton iconSoure={BulbIcon} count={45} onPress={() => console.log('suggest')} />
      </ActionButtonGroup>
    );
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <View style={{ marginTop: 15, marginBottom: 15, marginRight: 10, marginLeft: 10 }}>
          {this.renderUserDetail()}
          {this.renderCardContent()}
        </View>

        {this.renderActionButtons()}
      </View>
    );
  }
}

const styles = {
  containerStyle: {

  }
};

export default connect(
  null,
  null
)(GoalCard);
