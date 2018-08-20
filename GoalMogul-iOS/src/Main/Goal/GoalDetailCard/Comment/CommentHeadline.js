import React from 'react';
import { View, Image, Text } from 'react-native';

/* Components */
import Name from '../../Common/Name';
import Timestamp from '../../Common/Timestamp';

/* Asset */
import badge from '../../../../asset/utils/badge.png';
import dropDown from '../../../../asset/utils/dropDown.png';

const CommentHeadline = (props) => {
  // TODO: format time
  const { item } = props;
  const { owner, commentType, suggestion } = item;

  switch (commentType) {
    case 'Suggestion': {
      const { suggestionFor, suggestionForRef } = suggestion;
      const text = suggestionFor === 'Goal'
        ? ` ${suggestionFor}: ${suggestionForRef.title}`
        : ` ${suggestionFor} ${suggestionForRef.order}: ${suggestionForRef.description}`;

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
              <Image source={dropDown} />
            </View>
          </View>
          <Timestamp time='5 mins ago' />
        </View>
      );
    }

    case 'Reply':
    case 'Comment':
    default:
      return (
        <View style={styles.containerStyle}>
          <Name text={owner.name} textStyle={{ fontSize: 12 }} />
          <Image style={styles.imageStyle} source={badge} />
          <Timestamp time='5 mins ago' />
          <View style={styles.caretContainer}>
            <Image source={dropDown} />
          </View>
        </View>

      );
  }
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  caretContainer: {
    position: 'absolute',
    right: 2,
    top: 2
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
    paddingRight: 12
  },
  suggestionDetailTextStyle: {
    fontWeight: '700',
    color: '#6bc6f0'
  }
};

export default CommentHeadline;
