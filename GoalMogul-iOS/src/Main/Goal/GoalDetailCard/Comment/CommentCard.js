import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

// Components
import CommentUserDetail from './CommentUserDetail';
import ChildCommentCard from './ChildCommentCard';

// Assets
import ReplyIcon from '../../../../asset/utils/reply.png';

class CommentCard extends React.Component {
  // Render child comments if there are some.
  renderChildComments() {
    const { childComments, numberOfChildrenShowing, hasMoreToShow } = this.props.item;
    if (!childComments || childComments.length === 0) return '';

    // For child comments, only load the first three
    const childCommentCards = childComments.map((comment, index) => {
      if (index < numberOfChildrenShowing) {
        return (
          <View key={index} style={{ flexDirection: 'row', marginTop: 0.5 }}>
            <ChildCommentIcon />
            <View style={{ flex: 1 }}>
              <ChildCommentCard item={comment} />
            </View>
          </View>
        );
      }
    });

    if (hasMoreToShow) {
      childCommentCards.push(
        <TouchableOpacity
          key={childComments.length}
          onPress={() => console.log('Loading more comments')}
          style={{ marginTop: 0.5 }}
        >
          <Text
            style={{
              alignSelf: 'center',
              color: '#4ec9f3',
              padding: 5
            }}
          >Load more replies ({childComments.length - numberOfChildrenShowing})</Text>
        </TouchableOpacity>
      );
    }
    return (
      <View>
        {childCommentCards}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.cardContainerStyle}>
        <CommentUserDetail {...this.props} />
        {this.renderChildComments()}
      </View>
    );
  }
}
// <CommentRef item={item.}/>

const ChildCommentIcon = () => {
  return (
    <View style={styles.replyIconContainerStyle}>
      <Image source={ReplyIcon} style={styles.replyIconStyle} />
    </View>
  );
};

const styles = {
  cardContainerStyle: {
    marginBottom: 0.5
  },

  // Styles related to child comments
  replyIconStyle: {
    height: 20,
    width: 20,
    tintColor: '#d2d2d2'
  },
  replyIconContainerStyle: {
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44
  }
};

export default CommentCard;
