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
import PriorityBar from '../../Common/PriorityBar';

// Assets
import LoveIcon from '../../../asset/utils/love.png';
// import BulbIcon from '../../../asset/utils/bulb.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';
import ProgressBarSmall from '../../../asset/utils/progressBar_small.png';
import ProgressBarSmallCounter from '../../../asset/utils/progressBar_counter_small.png';

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
   * This method renders category and timestamp
   */
  renderHeader(item) {
    const { category, created } = item;
    return (
      <View style={styles.headerContainerStyle}>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 11,
              color: '#6d6d6d',
              fontWeight: '600',
              alignSelf: 'center'
            }}
          >
            {category}
          </Text>
        </View>
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <Timestamp time={timeago().format(created)} />
        </View>
      </View>
    );
  }

  /**
   * This method renders goal title
   */
  renderTitle(item) {
    const { title } = item;
    return (
      <Text
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 15, marginTop: 4 }}
        numberOfLines={1}
        ellipsizeMode='tail'
      >
        {title}
      </Text>
    );
  }

  renderProgressBar(item) {
    const { start, end, steps, needs } = item;
    return (
      <View style={{ marginTop: 8 }}>
        <ProgressBar
          startTime={start}
          endTime={end}
          steps={steps}
          needs={needs}
          goalRef={item}
          iconSource={ProgressBarSmall}
          edgeIconSource={ProgressBarSmallCounter}
          height={11}
          width={200}
          marginRight={7}
        />
      </View>
    );
  }

  /**
   * THis method renders stats including like, forward and suggestion count
   */
  renderStats(item) {
    const likeCount = item.likeCount ? item.likeCount : 0;
    const commentCount = item.commentCount ? item.commentCount : 0;
    const shareCount = item.shareCount ? item.shareCount : 0;

    return (
      <View style={{ display: 'flex', justifyContent: 'space-between', marginLeft: 8, marginRight: 8 }}>
        <StatsComponent
          iconSource={LoveIcon}
          iconStyle={styles.loveIconStyle}
          text={likeCount}
          textStyle={styles.loveTextStyle}
        />
        <StatsComponent
          iconSource={ShareIcon}
          iconStyle={styles.shareIconStyle}
          text={shareCount}
          textStyle={styles.shareTextStyle}
        />
        <StatsComponent
          iconSource={CommentIcon}
          iconStyle={styles.commentIconStyle}
          text={commentCount}
          textStyle={styles.commentTextStyle}
        />
      </View>
    );
  }

  renderPriorityBar(item) {
    const { priority } = item;
    return (
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.priorityTextStyle}>Priority</Text>
        <PriorityBar priority={priority} />
      </View>
    );
  }

  render() {
    const { item } = this.props;
    if (!item || _.isEmpty(item)) return null;

    return (
      <TouchableOpacity activeOpacity={0.6}
        style={styles.cardContainerStyle}
        onPress={() => this.handleOnCardPress(item)}
      >
        <View style={{ flex: 1 }}>
          {this.renderHeader(item)}
          {this.renderTitle(item)}
          {this.renderProgressBar(item)}
        </View>
        {this.renderStats(item)}
        {this.renderPriorityBar(item)}
      </TouchableOpacity>
    );
  }
}

const StatsComponent = (props) => {
  const { iconStyle, textStyle, iconSource, text } = props;
  const { statsTextDefaultStyle, statsIconDefaultStyle } = styles;
  return (
    <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5 }}>
      <Image source={iconSource} style={{ ...statsIconDefaultStyle, ...iconStyle }} />
      <Text style={{ ...statsTextDefaultStyle, ...textStyle }}>{text}</Text>
    </View>
  );
};

const styles = {
  cardContainerStyle: {
    marginBottom: 2,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    shadowColor: 'lightgray',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 5
  },
  priorityTextStyle: {
    fontSize: 7,
    fontStyle: 'italic',
    color: 'darkgray'
  },
  // Stats component default style
  statsTextDefaultStyle: {
    fontSize: 9
  },
  statsIconDefaultStyle: {
    height: 12,
    width: 12,
    marginRight: 2
  },
  // Stats component style
  loveIconStyle: {
    tintColor: '#e26162',
    width: 12,
    height: 11
  },
  loveTextStyle: {
    color: '#e26162'
  },
  shareIconStyle: {
    tintColor: '#8ec776'
  },
  shareTextStyle: {
    color: '#8ec776'
  },
  commentIconStyle: {
    tintColor: '#f1bf74'
  },
  commentTextStyle: {
    color: '#f1bf74'
  }
};

export default connect(
  null,
  {
    openGoalDetail
  }
)(ProfileGoalCard2);
