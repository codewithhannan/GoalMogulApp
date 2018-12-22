import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated
} from 'react-native';
import { Font } from 'expo';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

// Styles
import { APP_BLUE_BRIGHT, APP_DEEP_BLUE } from '../styles';

// Assets
import LOGO from '../../assets/logo.png';

// Actions
import { tutorial as TutorialAction } from '../redux/modules/auth/Tutorial';

// Components
import ProgressBar from './ProgressBar';
import Challenge from './Challenge';
import Learn from './Learn';
import Tribe from './Tribe';
import Host from './Host';

const DEBUG_KEY = '[ UI Tutorial ]';
const DURATION = 500;
const PAUSE = 6000;
/**
 * This tutorial will show the animation with the sequence
 * 1. Challenge
 * 2. Learn
 * 3. Tribe
 * 4. Host
 */
class Tutorial extends React.Component {
  constructor(props) {
    super(props);
    // Expo.SplashScreen.preventAutoHide();
    this.state = {
      fontLoaded: false,
    };
    this.challengeAnim = new Animated.Value(0);
    this.LearnAnim = new Animated.Value(0);
    this.TribeAnim = new Animated.Value(0);
    this.HostAnim = new Animated.Value(0);
    this.progress = new Animated.Value(0);

    this.animate = this.animate.bind(this);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'gotham-pro': require('../../assets/fonts/GothamPro.ttf'),
      'gotham-pro-bold': require('../../assets/fonts/GothamPro-Bold.ttf')
    });
    this.setState({ fontLoaded: true });
  }

  componentDidUpdate() {
    if (this.state.fontLoaded) {
      this.animate();
    }
  }

  animate(extraAnimation = [], extraDuration = 0) {
    const sequenceAnimations = Animated.sequence([
      ...extraAnimation,
      Animated.delay(500),
      // Show challenge
      Animated.timing(this.challengeAnim,
        { duration: DURATION, toValue: 1 }
      ),
      Animated.delay(PAUSE),
      Animated.timing(this.challengeAnim,
        { duration: DURATION, toValue: 0 }
      ),
      // Show Learn
      Animated.timing(this.LearnAnim,
        { duration: DURATION, toValue: 1 }
      ),
      Animated.delay(PAUSE),
      Animated.timing(this.LearnAnim,
        { duration: DURATION, toValue: 0 }
      ),
      // Show Tribe
      Animated.timing(this.TribeAnim,
        { duration: DURATION, toValue: 1 }
      ),
      Animated.delay(PAUSE),
      Animated.timing(this.TribeAnim,
        { duration: DURATION, toValue: 0 }
      ),
      // Show Host
      Animated.timing(this.HostAnim,
        { duration: DURATION, toValue: 1 }
      )
    ]);

    const parallelAnimation = Animated.parallel([
      sequenceAnimations,
      Animated.timing(this.progress, {
        duration: ((7 * DURATION) + (4 * PAUSE) + extraDuration),
        toValue: 1
      }),
    ]);
    parallelAnimation.start();
  }

  handleContinue = () => {
    const { userId } = this.props;
    const onSuccess = (change) => {
      console.log(`${DEBUG_KEY}: setting tutorial success for user: ${userId},` +
        `user prev tutorial status: ${change}`);
    };
    const onError = (err) => {
      console.log(`${DEBUG_KEY}: error setting user tutorial shown: `, err);
      return;
    };
    TutorialAction.setTutorialShown(userId, onSuccess, onError);
    Actions.mainTabs();
  }

  handleReplay = () => {
    this.progress.setValue(0);
    this.animate([
      Animated.timing(this.HostAnim,
        { duration: DURATION, toValue: 0 }
      )
    ], DURATION);
  }

  // Header contains Logo with text
  renderHeader() {
    return (
      <View style={styles.headerContainerStyle}>
        <Image source={LOGO} style={styles.logoImageStyle} />
        {
          this.state.fontLoaded ?
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.headerBoldTextStyle}>Goal</Text>
              <Text style={styles.headerTextStyle}>Mogul</Text>
            </View>
          : null
        }
      </View>
    );
  }

  // barColor='#055c7a'
  // #007FAD
  render() {
    if (!this.state.fontLoaded) return '';
    return (
      <View style={styles.containerStyle}>
        {this.renderHeader()}
        <View style={{ height: 10, width: '100%' }}>
          <ProgressBar
            progress={this.progress}
            fillColor={`${APP_DEEP_BLUE}`}
            barColor='#124562'
          />
        </View>

        <View style={styles.subViewContainerStyle}>
          <Challenge opacity={this.challengeAnim} />
        </View>

        <View style={styles.subViewContainerStyle}>
          <Learn opacity={this.LearnAnim} />
        </View>

        <View style={styles.subViewContainerStyle}>
          <Tribe opacity={this.TribeAnim} />
        </View>

        <View style={styles.subViewContainerStyle}>
          <Host
            opacity={this.HostAnim}
            continue={this.handleContinue}
            replay={this.handleReplay}
          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: APP_BLUE_BRIGHT,
    flex: 1,
    alignItems: 'center'
  },
  subViewContainerStyle: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    bottom: 0
  },
  /* Header related styles */
  headerContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 50,
    paddingBottom: 30
  },
  logoImageStyle: {
    height: 50,
    width: 50,
    marginRight: 10,
    marginBottom: 5
  },
  headerTextStyle: {
    fontSize: 36,
    color: '#ffffff',
    fontFamily: 'gotham-pro'
  },
  headerBoldTextStyle: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: '800',
    fontFamily: 'gotham-pro-bold'
  },
  /* Header related styles end */
});

const mapStateToProps = state => {
  const { userId } = state.user;
  return {
    userId
  };
};

export default connect(
  mapStateToProps,
  {

  }
)(Tutorial);
