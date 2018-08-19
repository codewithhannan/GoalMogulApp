import React from 'react';
import {
  View
} from 'react-native';

// Components
import CommentUserDetail from './CommentUserDetail';
import Tag from '../../Common/Tag';

class CommentCard extends React.Component {

  renderCommentRef(item) {

  }

  render() {
    const { item } = this.props;

    return (
      <View style={styles.cardContainerStyle}>
        <CommentUserDetail item={item} />

      </View>
    );
  }
}
// <CommentRef item={item.}/>

const styles = {
  cardContainerStyle: {
    marginBottom: 0.5
  }
};

export default CommentCard;
