import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

/* Asset */
import Logo from '../../asset/header/logo.png';
import IconMenu from '../../asset/header/menu.png';
import Setting from '../../asset/header/setting.png';

/* Actions */
import { back, openProfile, openSetting } from '../../actions';

/**
  TODO: refactor element to have consistent behavior
  rightIcon: 'empty' or null,
  backButton: true or false,
  setting: true or false
*/
class SearchBarHeader extends Component {

  handleBackOnClick() {
    if (this.props.onBackPress) {
      this.props.onBackPress();
    }
    this.props.back();
  }

  handleProfileOnClick() {
    this.props.openProfile(this.props.userId);
  }

  handleSettingOnClick() {
    // TODO: open account setting page
    this.props.openSetting();
  }

  renderSearchBarLeftIcon() {
    if (this.props.backButton) {
      return (
        <TouchableWithoutFeedback onPress={this.handleBackOnClick.bind(this)}>
          <View style={styles.headerLeftImage}>
            <Icon
              type='entypo'
              name='chevron-thin-left'
              containerStyle={{ justifyContent: 'flex-start' }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableWithoutFeedback onPress={this.handleProfileOnClick.bind(this)}>
        <Image style={styles.headerLeftImage} source={Logo} />
      </TouchableWithoutFeedback>
    );
  }

  renderSearchBarRightIcon() {
    if (this.props.setting && this.props.haveSetting) {
      return (
        <TouchableWithoutFeedback onPress={this.handleSettingOnClick.bind(this)}>
          <Image style={styles.headerRightImage} source={Setting} />
        </TouchableWithoutFeedback>
      );
    }
    if (this.props.rightIcon === 'menu') {
      return (
        <Image style={styles.headerRightImage} source={IconMenu} />
      );
    }
    return (
      <View style={styles.headerRightImage} />
    );
  }

  renderSearchBarOrTitle() {
    if (this.props.title) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20 }} >
            {this.props.title}
          </Text>
        </View>
      );
    }
    return (
      <SearchBar
        round
        inputStyle={styles.searchInputStyle}
        containerStyle={styles.searchContainerStyle}
        icon={{ type: 'font-awesome', name: 'search', style: styles.searchIconStyle }}
        placeholder='Search GoalMogul'
      />
    );
  }

  render() {
    return (
      <View style={styles.headerStyle}>
        {this.renderSearchBarLeftIcon()}
        {this.renderSearchBarOrTitle()}
        {this.renderSearchBarRightIcon()}
      </View>
    );
  }
}

const styles = {
  searchContainerStyle: {
    backgroundColor: '#ffffff',
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 0,
    flex: 4,
    marginRight: 3,
  },
  searchInputStyle: {
    backgroundColor: '#f3f4f6',
    fontSize: 12,
    height: 28
  },
  searchIconStyle: {
    top: 14,
    fontSize: 13
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 28,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 10
  },
  headerLeftImage: {
    width: 25,
    height: 25,
    marginTop: 10,
  },
  headerRightImage: {
    width: 25,
    height: 25,
    marginTop: 11,
  }
};

const mapStateToProps = state => {
  const { userId } = state.user;
  const haveSetting = state.profile.userId.toString() === state.user.userId.toString();

  return {
    userId,
    haveSetting
  };
};

export default connect(mapStateToProps, { back, openProfile, openSetting })(SearchBarHeader);
