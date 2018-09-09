import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import timeago from 'timeago.js';

// Component
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ActionButton from '../Common/ActionButton';
import ActionButtonGroup from '../Common/ActionButtonGroup';
import SectionCard from '../Common/SectionCard';
import NextButton from '../Common/NextButton';

// Asset
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png';
import LoveIcon from '../../../asset/utils/love.png';
import BulbIcon from '../../../asset/utils/bulb.png';
import ShareIcon from '../../../asset/utils/forward.png';

class NeedCard extends Component {

  // card central content
  renderCardContent(item) {
    const { description } = item;
    return (
      <View style={{ marginTop: 20 }}>
        <Text style={{ color: '#505050' }}>
          {description}
        </Text>
      </View>
    );
  }

  // user basic information
  renderUserDetail(item) {
    const { created, needRequest, category, owner, _id } = item;
    const { description } = needRequest;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;

    return (
      <View style={{ flexDirection: 'row' }}>
        <Image source={defaultProfilePic} resizeMode='contain' style={{ height: 60, width: 60 }} />
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            caretOnPress={() => this.props.createReport(_id, 'goal', 'User')}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: '#818181', fontSize: 11 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {description}
            </Text>
          </View>

        </View>
      </View>
    );
  }

  renderNeed() {
    return <SectionCard />;
  }

  renderViewGoal() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10
        }}
        onPress={() => this.props.onPress}
      >
        <Text style={styles.viewGoalTextStyle}>View Goal</Text>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Icon
            name='ios-arrow-round-forward'
            type='ionicon'
            color='#45C9F6'
            iconStyle={styles.iconStyle}
          />
        </View>
      </TouchableOpacity>
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
    const { item } = this.props;
    const { owner } = item;
    const { name } = owner;
    return (
      <View>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={{ marginBottom: 0.5, backgroundColor: 'white', padding: 5 }}>
              <Text style={{ fontSize: 11 }}>
                <Text style={{ fontWeight: '800' }}>{name} </Text>
                  share a need
              </Text>
            </View>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 20, marginBottom: 20, marginRight: 15, marginLeft: 15 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent(item)}
              </View>
            </View>

            {this.renderNeed()}

            <View style={{ ...styles.containerStyle }}>
              {this.renderViewGoal()}
              {this.renderActionButtons()}
            </View>
          </View>
        </View>

        <NextButton onPress={() => console.log('press for next item')} />
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white'
  },
  viewGoalTextStyle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#45C9F6',
    alignSelf: 'center'
  },
  iconStyle: {
    alignSelf: 'center',
    fontSize: 20,
    marginLeft: 5,
    marginTop: 2
  },
  borderShadow: {
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  }
};

export default connect(
  null,
  null
)(NeedCard);
