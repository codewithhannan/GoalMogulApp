import React from 'react';
import {
  View,
  StyleSheet,
  ViewPropTypes,
  Text,
  Linking
} from 'react-native';
import { connect } from 'react-redux';
import ParsedText from 'react-native-parsed-text';
import PropTypes from 'prop-types';
import Decode from 'unescape';
import _ from 'lodash';
import Hyperlink from 'react-native-hyperlink'

// Styles
import {
  APP_BLUE_BRIGHT,
  APP_DEEP_BLUE
} from '../../../styles';

// Utils
import {
  URL_REGEX
} from '../../../Utils/Constants';

const DEBUG_KEY = '[ UI RichText ]';

class RichText extends React.Component {
  constructor(props) {
    super(props);
    this.handleUrlPress = this.handleUrlPress.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only update if bricks change
    // console.log(`${DEBUG_KEY}: [ shouldComponentUpdate ]: ${this.props.contentText}`);
    return !_.isEqual(nextProps.numberOfLines, this.props.numberOfLines);
  }

  constructParsedUserTags(contentTags = [], contentText) {
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

  handleUrlPress = async (url) => {
    // TODO: open web url
    if (this.props.handleUrlPress) {
      return this.props.handleUrlPress(url);
    }
    console.log(`${DEBUG_KEY}: url on pressed: `, url);
    
    // Below is the original expo webbrowser way of opening but it doesn't work in real
    // build environment
    // const returnUrl = Expo.Linking.makeUrl('/');
    // Expo.Linking.addEventListener('url', this.handleSuggestionLinkOnClose);
    // const result = await WebBrowser.openBrowserAsync(url);
    // Expo.Linking.removeEventListener('url', this.handleSuggestionLinkOnClose);

    // Se we switch to the new react native way
    let urlToOpen = url;

    const canOpen = await Linking.canOpenURL(urlToOpen);
    if (canOpen) {
      console.log(`${DEBUG_KEY}: open url:`, urlToOpen);
      await Linking.openURL(urlToOpen);
      return;
    }


    if (!urlToOpen.match(/^[a-zA-Z]+:\/\//)) {
      urlToOpen = 'http://' + urlToOpen;
    }

    const canOpenWithProtocal = await Linking.canOpenURL(urlToOpen);
    
    if (canOpenWithProtocal) {
      console.log(`${DEBUG_KEY}: open url with protocal added:`, urlToOpen);
      await Linking.openURL(urlToOpen);
      return;
    }

    console.log(`${DEBUG_KEY}: failed to open url: `, urlToOpen);    
  }

  render() {
    const {
      contentText,
      contentTags,
    } = this.props;

    if (!contentText) return null;

    // console.log(`${DEBUG_KEY}: render contentText: ${contentText.substring(10)}`);

    const parsedTags = this.constructParsedUserTags(contentTags, contentText);
    const convertedText = Decode(contentText);

    // Following is the original url detection for ParsedText. After we added HyperLink, this is no longer needed.
    // { type: 'url', style: styles.url, onPress: this.handleUrlPress },
    // { 
    //   pattern: URL_REGEX, // Additional regex to match without HTTP protocal
    //   style: styles.url,
    //   onPress: this.handleUrlPress
    // },
    return (
      <View style={[this.props.textContainerStyle]}>
        {/* <Hyperlink linkStyle={styles.url} onPress={(url, text) => this.handleUrlPress(url)}> */}
          <ParsedText
            {...this.props}
            style={[this.props.textStyle]}
            parse={
              [
                { type: 'url', style: styles.url, onPress: this.handleUrlPress },
                { 
                  pattern: URL_REGEX, // Additional regex to match without HTTP protocal
                  style: styles.url,
                  onPress: this.handleUrlPress
                },
                // { type: 'phone', style: styles.phone, onPress: this.handlePhonePress },
                // { type: 'email', style: styles.email, onPress: this.handleEmailPress },
                ...parsedTags
              ]
            }
            childrenProps={{ allowFontScaling: false }}
          >
            {convertedText}
          </ParsedText>
        {/* </Hyperlink> */}
      </View>
    );
  }
}

const styles = {
  url: {
    color: APP_BLUE_BRIGHT
  },
  userTag: {
    color: APP_DEEP_BLUE,
    // textDecorationLine: 'underline',
  }
};

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
