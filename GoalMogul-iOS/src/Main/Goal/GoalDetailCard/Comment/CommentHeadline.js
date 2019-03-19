import React from 'react';
import { View, Image, Text } from 'react-native';
import timeago from 'timeago.js';
import _ from 'lodash';

/* Components */
import Name from '../../Common/Name';
import Timestamp from '../../Common/Timestamp';
import { MenuFactory } from '../../../Common/MenuFactory';
import { switchCaseBannerSource } from '../../../../actions';

/* Asset */
import badge from '../../../../asset/utils/badge.png';

// Constants
import { 
  CARET_OPTION_NOTIFICATION_SUBSCRIBE,
  CARET_OPTION_NOTIFICATION_UNSUBSCRIBE
} from '../../../../Utils/Constants';

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
  const { item, caretOnPress, goalRef, isCommentOwner, onNamePress } = props;
  const { owner, commentType, suggestion, created, maybeIsSubscribed } = item;
  const timeStamp = (created === undefined || created.length === 0)
    ? new Date() : created;

  const menu = !isCommentOwner ?
  MenuFactory(
    [
      'Report',
      maybeIsSubscribed ? CARET_OPTION_NOTIFICATION_UNSUBSCRIBE : CARET_OPTION_NOTIFICATION_SUBSCRIBE
    ],
    (val) => caretOnPress(val),
    '',
    { paddingBottom: 8, paddingRight: 8, paddingLeft: 10, paddingTop: 1 },
    () => console.log('Report Modal is opened')
  ) :
  MenuFactory(
    [
      'Delete'
    ],
    (val) => caretOnPress(val),
    '',
    // { paddingBottom: 10, paddingLeft: 5, paddingRight: 5, paddingTop: 5 },
    { paddingBottom: 8, paddingRight: 8, paddingLeft: 10, paddingTop: 1 },
    () => console.log('Report Modal is opened')
  );

  switch (commentType) {
    case 'Suggestion': {
      if (!suggestion || _.isEmpty(suggestion)) return null;
      return (
        <SuggestionHeadline
          goalRef={goalRef}
          item={item}
          timeStamp={timeStamp}
          menu={menu}
          onNamePress={onNamePress}
        />
      );
    }

    case 'Comment': {
      return (
        <CommentHead 
          goalRef={goalRef}
          item={item}
          timeStamp={timeStamp}
          menu={menu}
          onNamePress={onNamePress}
        />
      );
    }


    case 'Reply':
    default:
      return (
        <View style={styles.containerStyle}>
          <Name 
            text={owner.name} 
            textStyle={{ fontSize: 12 }} 
            onPress={onNamePress}  
          />
          <UserBanner user={owner} />
          <Timestamp time={timeago().format(timeStamp)} />
            <View style={styles.caretContainer}>
              {menu}
            </View>
        </View>

      );
  }
};

const CommentHead = (props) => {
  const { goalRef, item, timeStamp, menu, onNamePress } = props;
  const { owner, needRef, stepRef } = item;

  let text;
  if (needRef) {
    text = suggestionForNeedStepText(goalRef, 'Need', needRef);
  }

  if (stepRef) {
    text = suggestionForNeedStepText(goalRef, 'Step', stepRef);
  }

  if (needRef || stepRef) {
    return (
      <View>
        <View style={styles.containerStyle}>
          <Text
            onPress={onNamePress}
            style={{ 
              fontSize: 12,
              fontWeight: '600',
              maxWidth: 150,
            }} 
            numberOfLines={1}
          >
            {owner.name}
          </Text>
          <UserBanner user={owner} />
          <Text
            style={{ ...styles.suggestionTextStyle }}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            commented for
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
  }

  return (
    <View style={styles.containerStyle}>
      <Name 
        text={owner.name} 
        textStyle={{ fontSize: 12 }} 
        onPress={onNamePress}  
      />
      <UserBanner user={owner} />
      <Timestamp time={timeago().format(timeStamp)} />
      <View style={styles.caretContainer}>
        {menu}
      </View>
    </View>
  );
};

const UserBanner = (props) => {
  const { user, iconStyle } = props;

  if (!user || !user.profile || user.profile.pointsEarned === undefined) return '';
  const { profile } = user;
  const { pointsEarned } = profile;
  const source = switchCaseBannerSource(pointsEarned);

  const defaultIconStyle = {
    alignSelf: 'center',
    marginLeft: 4,
    marginRight: 4,
    height: 14,
    width: 10
  };
  return (
    <Image source={source} style={{ ...defaultIconStyle, ...iconStyle }} />
  );
};

const SuggestionHeadline = (props) => {
  const { goalRef, item, timeStamp, menu, onNamePress } = props;
  const { owner, suggestion } = item;
  if (!goalRef) return '';

  const { suggestionFor, suggestionForRef } = suggestion;
  const text = suggestionFor === 'Goal'
    ? suggestionForGoalText(goalRef)
    : suggestionForNeedStepText(goalRef, suggestionFor, suggestionForRef);

  return (
    <View>
      <View style={styles.containerStyle}>
        <Name text={owner.name} textStyle={{ fontSize: 12 }} onPress={onNamePress} />
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
