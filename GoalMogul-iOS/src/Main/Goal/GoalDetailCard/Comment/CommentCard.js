import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard
} from 'react-native';

// Components
import CommentUserDetail from './CommentUserDetail';
import ChildCommentCard from './ChildCommentCard';

// Assets
import ReplyIcon from '../../../../asset/utils/reply.png';

class CommentCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      childCommentLayouts: {},
      totalViewHeight: 0,
      keyboardHeight: 0
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  onLayout = (e, index) => {
    const childCommentLayouts = this.state.childCommentLayouts;
    childCommentLayouts[index] = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
      x: e.nativeEvent.layout.x,
      y: e.nativeEvent.layout.y,
    };
    this.setState({ childCommentLayouts, totalViewHeight: getTotalViewHeight(this.state) });
  }

  _keyboardDidShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  _keyboardDidHide = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height
    });
  };

  // update user detail layout for childcomments computing
  updateUserDetailLayout = (layout) => {
    this.setState({
      userDetailLayout: layout,
      totalViewHeight: getTotalViewHeight(this.state)
    });
  }

  // Render child comments if there are some.
  renderChildComments() {
    const { childComments, numberOfChildrenShowing, hasMoreToShow } = this.props.item;
    if (!childComments || childComments.length === 0) return '';

    // For child comments, only load the first three
    const childCommentCards = childComments.map((comment, index) => {
      if (index < numberOfChildrenShowing + 2) {
        const viewOffset = getTotalPrevHeight(this.state, index) - this.state.keyboardHeight;
        return (
          <View
            key={index}
            style={{ flexDirection: 'row', marginTop: 0.5 }}
            onLayout={(e) => this.onLayout(e, `${index}`)}
          >
            <ChildCommentIcon />
            <View style={{ flex: 1 }}>
              <ChildCommentCard item={comment} {...this.props} viewOffset={viewOffset} />
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
    const viewOffset = getTotalPrevHeight(this.state) - this.state.keyboardHeight;
    return (
      <View style={styles.cardContainerStyle}>
        <CommentUserDetail
          {...this.props}
          ref="userDetail"
          onLayout={(layout) => this.updateUserDetailLayout(layout)}
          viewOffset={viewOffset}
        />
        {this.renderChildComments()}
      </View>
    );
  }
}
// <CommentRef item={item.}/>

const getTotalPrevHeight = (state, index) => {
  const { childCommentLayouts } = state;
  const i = index === undefined ? -1 : index

  const totalHeights = Object.entries(childCommentLayouts).reduce((total, [key, value]) => {
    if (parseInt(key, 10) > i) {
      return total + parseInt(value.height, 10);
    }
    return total;
  }, 0);

  return totalHeights;
};

const getTotalViewHeight = (state) => {
  const { userDetailLayout, childCommentLayouts } = state;

  let totalHeights = Object.entries(childCommentLayouts).reduce((total, [key, value]) => {
      return total + parseInt(value.height, 10);
  }, 0);
  if (userDetailLayout && userDetailLayout.height) {
    totalHeights -= userDetailLayout.height;
  }

  return totalHeights;
}

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