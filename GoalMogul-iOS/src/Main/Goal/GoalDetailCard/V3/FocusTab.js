import React from 'react';
import {
  View,
  FlatList,
  KeyboardAvoidingView,
  Animated,
  StyleSheet,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

// Components
import EmptyResult from '../../../Common/Text/EmptyResult';
import CommentBox from '../../Common/CommentBox';
import CommentCard from '../Comment/CommentCard';

// Assets

// Actions

// Styles
import { BACKGROUND_COLOR } from '../../../../styles';

// Utils
import { switchCase } from '../../../../redux/middleware/utils';

// Constants
const DEBUG_KEY = '[ UI FocusTab ]';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const TABBAR_HEIGHT = 48.5;
const COMMENTBOX_HEIGHT = 43;
const TOTAL_HEIGHT = TABBAR_HEIGHT;

class FocusTab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyboardHeight: 0,
      position: 'absolute',
      commentBoxPadding: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow);
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = (e) => {
    this.flatlist.getNode().scrollToOffset({
    // this.flatlist.scrollToOffset({
      offset: e.endCoordinates.height - TOTAL_HEIGHT,
      animated: true
    });
    Animated.timing(this.state.commentBoxPadding, {
      toValue: e.endCoordinates.height - TOTAL_HEIGHT,
      duration: 220
    }).start();
  }

  keyboardWillHide = () => {
    Animated.timing(this.state.commentBoxPadding, {
      toValue: 0,
      duration: 210
    }).start();
  }

  // Refresh goal detail and comments all together
  handleRefresh = () => {
    console.log(`${DEBUG_KEY}: user tries to refresh.`);
  }

  scrollToIndex = (index, viewOffset = 0) => {
    this.flatlist.getNode().scrollToIndex({
    // this.flatlist.scrollToIndex({
      index,
      animated: true,
      viewPosition: 1,
      viewOffset
    });
  }

  keyExtractor = (item) => {
    const { _id } = item;
    return _id;
  }

  dialogOnFocus = () => this.commentBox.focus();

  handleReplyTo = () => {
    this.commentBox.focusForReply();
  }

  renderItem = (props) => {
    const { goalDetail } = this.props;
    return (
      <CommentCard
        key={`comment-${props.index}`}
        item={props.item}
        index={props.index}
        commentDetail={{ parentType: 'Goal', parentRef: goalDetail._id }}
        goalRef={goalDetail}
        scrollToIndex={(i, viewOffset) => this.scrollToIndex(i, viewOffset)}
        onCommentClicked={() => this.handleReplyTo()}
        reportType='detail'
      />
    );
  }
  // <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding'>

  render() {
    const { data, type } = this.props;
    const emptyText = switchCaseEmptyText(type);
    return (
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>

        <AnimatedFlatList
          ref={ref => { this.flatlist = ref; }}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={this.keyExtractor}
          refreshing={this.props.loading || false}
          onRefresh={this.handleRefresh}
          ListEmptyComponent={
            this.props.loading ? '' :
            <EmptyResult
              text={emptyText}
              textStyle={{ paddingTop: 100 }}
            />
          }
          onScroll={this.props.onScroll}
          scrollEventThrottle={1}
          contentContainerStyle={{ ...this.props.contentContainerStyle }}
          style={{ height: 200 }}
        />
        <Animated.View
          style={[
            styles.composerContainer, {
              position: this.state.position,
              paddingBottom: this.state.commentBoxPadding
            }
          ]}
        >
          <CommentBox
            onRef={(ref) => { this.commentBox = ref; }}
            hasSuggestion
          />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  composerContainer: {
    left: 0,
    right: 0,
    bottom: 0
  }
});

const mapStateToProps = (state, props) => {

  // Initialize data by all comments
  let data = [];

  if (props.type === 'step' || 'need') {
    // TODO: grab comments by step, filter by typeRef
    data = data.filter((comment) => {
      if (comment.suggestion &&
          comment.suggestion.suggestionForRef &&
          comment.suggestion.suggestionForRef === props.typeRef) {
            return true;
      }
      return false;
    });
  }

  return {
    data, // Comments of interest
    // loading
  };
};

const switchCaseEmptyText = (type) => switchCase({
  comment: 'No Comments',
  step: 'No Comments for this step',
  need: 'No Comments for this need'
})('comment')(type);

FocusTab.defaultPros = {
  type: undefined, // ['comment', 'step', 'need']
  typeRef: undefined,
  goalDetail: undefined,
  isSelf: false
};

export default connect(
  mapStateToProps,
  null
)(FocusTab);
