/**
 * This component corresponds to My Goals2.2-1 design. New user page
 * condensed goal layout
 */
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';

// Components
import Timestamp from '../Common/Timestamp';
import ProgressBar from '../Common/ProgressBar';
import Category from '../Common/Category';

// Actions
import {
  openGoalDetail
} from '../../../redux/modules/home/mastermind/actions';


class ProfileGoalCard2 extends React.Component {

  /* Handler functions for actions */

  /**
   * Open Goal Detail page on Card pressed
   */
  handleOnCardPress = (item) => {
    this.props.openGoalDetail(item);
  }

  /* Renderers for views */

  /**
   * This method renders likes, forwards, recommendations, timestamp and category
   */
  renderStats(item) {

  }

  /**
   * This method renders goal title
   */
  renderTitle(item) {
    const { title } = item;
    return (
      <Text
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 13 }}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {title}
      </Text>
    );
  }

  renderProgressBar(item) {
    const { start, end } = item;
    return (
      <View style={{ marginTop: 8 }}>
        <ProgressBar startTime={start} endTime={end} />
      </View>
    );
  }

  renderPriorityBar() {

  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return '';

    return (
      <TouchableOpacity
        style={styles.cardContainerStyle}
        onPress={() => this.handleOnCardPress(item)}
      >
        <View style={{ flex: 1 }}>
          {this.renderStats(item)}
          {this.renderTitle(item)}
          {this.renderProgressBar(item)}
        </View>
        <View>
          {this.renderPriorityBar(item)}
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = {
  cardContainerStyle: {
    margin: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center'
  }
};

export default connect(
  null,
  {
    openGoalDetail
  }
)(ProfileGoalCard2);
