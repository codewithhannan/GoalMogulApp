import React from 'react';
import {
  View,
  StyleSheet,
  ViewPropTypes,
  Text
} from 'react-native';
import { connect } from 'react-redux';
import ParsedText from 'react-native-parsed-text';
import PropTypes from 'prop-types';

// Styles
import {
  APP_BLUE_BRIGHT,
  APP_DEEP_BLUE
} from '../../../styles';

const DEBUG_KEY = '[ UI RichText ]';

class RichText extends React.PureComponent {

  constructParsedUserTags(contentTags, contentText) {
    const ret = contentTags.map((tag) => {
      const { startIndex, endIndex, user } = tag;
      const tagText = contentText.slice(startIndex, endIndex);
      const tagReg = `\\B${tagText}`;
      return {
        pattern: new RegExp(tagReg),
        style: styles.userTag,
        onPress: () => this.props.onUserTagPressed(user)
      };
    });

    return ret;
  }

  handleUrlPress(url) {
    // TODO: open web url
    console.log(`${DEBUG_KEY}: url on pressed: `, url);
  }

  render() {
    const {
      contentText,
      contentTags,
    } = this.props;

    if (!contentText) return '';

    const parsedTags = this.constructParsedUserTags(contentTags, contentText);

    return (
      <View style={[this.props.textContainerStyle]}>
        <ParsedText
          {...this.props}
          style={[this.props.textStyle]}
          parse={
            [
              { type: 'url', style: styles.url, onPress: this.handleUrlPress },
              // { type: 'phone', style: styles.phone, onPress: this.handlePhonePress },
              // { type: 'email', style: styles.email, onPress: this.handleEmailPress },
              ...parsedTags
            ]
          }
          childrenProps={{ allowFontScaling: false }}
        >
          {contentText}
        </ParsedText>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  url: {
    color: APP_BLUE_BRIGHT
  },
  userTag: {
    color: APP_DEEP_BLUE,
    // textDecorationLine: 'underline',
  }
});

export default connect(
  null,
  null
)(RichText);

RichText.propTypes = {
  textContainerStyle: ViewPropTypes.style,
  textStyle: Text.propTypes.style,
  onUserTagPressed: PropTypes.func.isRequired
};

RichText.defaultProps = {
  textStyle: {

  },
  textContainerStyle: {
    flex: 1
  }
};
