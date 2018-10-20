// This component is used to display need on a user's profile page
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import timeago from 'timeago.js';
import { connect } from 'react-redux';

// Components
import Headline from '../Common/Headline';
import Timestamp from '../Common/Timestamp';
import ProgressBar from '../Common/ProgressBar';
import SectionCard from '../Common/SectionCard';

// Actions
import {
  openGoalDetail
} from '../../../redux/modules/home/mastermind/actions';

import {
  deleteGoal,
} from '../../../actions';

class ProfileNeedCard extends React.Component {

  handleCardOnPress(item) {
    this.props.openGoalDetail(item);
  }

  // Card central content. Progressbar for goal card
  renderCardContent(item) {
    const { needs, _id, owner } = item;
    const needsComponent = needs
      .filter((need) => need.isCompleted === false)
      .map((need, index) => {
        return (
          <SectionCard
            key={index}
            item={need}
            goalRef={_id}
            onPress={() => this.props.openGoalDetail(item)}
            isSelf={this.props.userId === owner._id}
          />
        );
      });
    return (
      <View>
        {needsComponent}
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
            isSelf={this.props.userId === owner._id}
            caretOnDelete={() => this.props.deleteGoal(_id)}
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
      <View style={{ marginTop: 3 }}>
        <View style={{ backgroundColor: '#f8f8f8', ...styles.borderShadow }}>
          <View style={{ backgroundColor: '#e5e5e5' }}>
            <View style={styles.containerStyle}>
              <View style={{ marginTop: 20, marginBottom: 20, marginRight: 15, marginLeft: 15 }}>
                <TouchableOpacity onPress={() => this.handleCardOnPress(item)}>
                {this.renderUserDetail(item)}
                </TouchableOpacity>
              </View>
            </View>
            {this.renderCardContent(item)}
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

const mapStateToProps = (state) => {
  const { userId } = state.user;

  return {
    userId
  };
};

export default connect(
  mapStateToProps,
  {
    openGoalDetail,
    deleteGoal
  }
)(ProfileNeedCard);
