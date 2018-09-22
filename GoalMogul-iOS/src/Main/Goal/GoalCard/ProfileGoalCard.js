// This component is used to display goal on a user's profile page
import React from 'react';
import {
  View,
  Text
} from 'react-native';
import timeago from 'timeago.js';

// Components
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ProgressBar from '../Common/ProgressBar';

class ProfileGoalCard extends React.Component {

  // Card central content. Progressbar for goal card
  renderCardContent() {
    return (
      <View style={{ marginTop: 20 }}>
        <ProgressBar startTime='Mar 2013' endTime='Nov 2011' />
      </View>
    );
  }

  // user basic information
  renderUserDetail(item) {
    const { title, owner, category, _id, created } = item;
    const timeStamp = (created === undefined || created.length === 0)
      ? new Date() : created;
    // TODO: verify all the fields have data

    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ marginLeft: 15, flex: 1 }}>
          <Headline
            name={owner.name}
            category={category}
            caretOnPress={() => this.props.createReport(_id, 'goal', 'Goal')}
          />
          <Timestamp time={timeago().format(timeStamp)} />
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text
              style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
              numberOfLines={3}
              ellipsizeMode='tail'
            >
              {title}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item) return '';

    return (
      <View>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 20, marginBottom: 20, marginRight: 15, marginLeft: 15 }}>
                {this.renderUserDetail(item)}
                {this.renderCardContent()}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    backgroundColor: 'white'
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

export default ProfileGoalCard;
