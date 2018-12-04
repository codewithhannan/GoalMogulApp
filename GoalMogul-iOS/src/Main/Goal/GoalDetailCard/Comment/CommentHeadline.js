import React from 'react';
import { View, Image, Text } from 'react-native';
import timeago from 'timeago.js';
import _ from 'lodash';

/* Components */
import Name from '../../Common/Name';
import Timestamp from '../../Common/Timestamp';
import { MenuFactory } from '../../../Common/MenuFactory';
import { UserBanner } from '../../../../actions';

/* Asset */
import badge from '../../../../asset/utils/badge.png';

/**
 * Props passed in are:
 * @param reportType={reportType}
 * @param isCommentOwner={isCommentOwner}
 * @param item={item}
 * @param goalRef
 * @param caretOnPress
 */
const CommentHeadline = (props) => {
  // TODO: format time
  const { item, caretOnPress, goalRef, isCommentOwner } = props;
  const { owner, commentType, suggestion, created } = item;
  const timeStamp = (created === undefined || created.length === 0)
    ? new Date() : created;

  const menu = !isCommentOwner ?
  MenuFactory(
    [
      'Report',
    ],
    (val) => caretOnPress(val),
    '',
    { paddingBottom: 10, paddingLeft: 5, paddingRight: 5, paddingTop: 5 },
    () => console.log('Report Modal is opened')
  ) :
  MenuFactory(
    [
      'Delete'
    ],
    (val) => caretOnPress(val),
    '',
    { paddingBottom: 10, paddingLeft: 5, paddingRight: 5, paddingTop: 5 },
    () => console.log('Report Modal is opened')
  );

  switch (commentType) {
    case 'Suggestion': {
      if (!suggestion || _.isEmpty(suggestion)) return '';
      return (
        <SuggestionHeadline
          goalRef={goalRef}
          item={item}
          timeStamp={timeStamp}
          menu={menu}
        />
      );
    }

    case 'Reply':
    case 'Comment':
    default:
      return (
        <View style={styles.containerStyle}>
          <Name text={owner.name} textStyle={{ fontSize: 12 }} />
          <UserBanner user={owner} />
          <Timestamp time={timeago().format(timeStamp)} />
            <View style={styles.caretContainer}>
              {menu}
            </View>
        </View>

      );
  }
};

const SuggestionHeadline = (props) => {
  const { goalRef, item, timeStamp, menu } = props;
  const { owner, suggestion } = item;
  if (!goalRef) return '';

  const { suggestionFor, suggestionForRef } = suggestion;
  const text = suggestionFor === 'Goal'
    ? suggestionForGoalText(goalRef)
    : suggestionForNeedStepText(goalRef, suggestionFor, suggestionForRef);

  return (
    <View>
      <View style={styles.containerStyle}>
        <Name text={owner.name} textStyle={{ fontSize: 12 }} />
        <Image style={styles.imageStyle} source={badge} />
        <Text
          style={styles.suggestionTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          suggested for
          <Text style={styles.suggestionDetailTextStyle}>
            {text}
          </Text>
        </Text>
        <View style={styles.caretContainer}>
          {menu}
        </View>
      </View>
      <Timestamp time={timeago().format(timeStamp)} />
    </View>
  );
};

const suggestionForGoalText = (goalRef) => ` Goal: ${goalRef.title}`;
const suggestionForNeedStepText = (goalRef, suggestionFor, suggestionForRef) => {
  let ret = '';
  const dataToGet = suggestionFor === 'Step'
    ? goalRef.steps
    : goalRef.needs;

  if (!dataToGet || _.isEmpty(dataToGet)) return '';
  dataToGet.forEach((item) => {
    if (item._id === suggestionForRef) {
      ret = ` ${suggestionFor} ${item.order}: ${item.description}`;
    }
  });
  return ret;
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  caretContainer: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  imageStyle: {
    alignSelf: 'center',
    marginLeft: 3,
    marginRight: 3
  },
  suggestionTextStyle: {
    fontSize: 10,
    flex: 1,
    flexWrap: 'wrap',
    alignSelf: 'center',
    color: '#767676',
    paddingRight: 15
  },
  suggestionDetailTextStyle: {
    fontWeight: '700',
    color: '#6bc6f0'
  }
};

export default CommentHeadline;
