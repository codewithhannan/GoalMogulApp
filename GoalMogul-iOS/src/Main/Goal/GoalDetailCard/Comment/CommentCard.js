import React from 'react';
import {
  View,
  Image
} from 'react-native';

// Components
import CommentUserDetail from './CommentUserDetail';
import Tag from '../../Common/Tag';

// Assets
import ReplyIcon from '../../../../asset/utils/reply.png';

class CommentCard extends React.Component {

  // Render child comments if there are some.
  renderChildComments() {
    const { childComments } = this.props.item;
    console.log('item is; ', this.props.item);
    if (!childComments || childComments.length === 0) return '';

    // For child comments, only load the first three
    const childCommentCards = childComments.map((comment, index) => {
      if (index < 3) {
        return (
          <View key={index} style={{ flexDirection: 'row', marginTop: 0.5 }}>
            <ChildCommentIcon />
            <View style={{ flex: 1 }}>
              <CommentCard item={comment} />
            </View>
          </View>
        );
      }
    });

    return (
      <View>
        {childCommentCards}
      </View>
    );
  }

  renderCommentRef(item) {

  }

  render() {
    const { item } = this.props;

    return (
      <View style={styles.cardContainerStyle}>
        <CommentUserDetail item={item} />
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
