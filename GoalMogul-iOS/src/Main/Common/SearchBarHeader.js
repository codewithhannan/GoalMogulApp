import React, { Component } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { SearchBar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

/* Asset */
import Logo from '../../asset/header/logo.png';
import IconMenu from '../../asset/header/menu.png';

/* Actions */
import { back, openProfile } from '../../actions';

class SearchBarHeader extends Component {

  handleBackOnClick() {
    this.props.back();
  }

  handleProfileOnClick(event) {
    // TODO: attach with open profile action with user id
    this.props.openProfile();
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

  render() {
    return (
      <View style={styles.headerStyle}>
        {this.renderSearchBarLeftIcon()}
        <SearchBar
          round
          inputStyle={styles.searchInputStyle}
          containerStyle={styles.searchContainerStyle}
          icon={{ type: 'font-awesome', name: 'search', style: styles.searchIconStyle }}
          placeholder='Search GoalMogul'
        />
        <Image style={styles.headerRightImage} source={IconMenu} />
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
    paddingTop: 30,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerLeftImage: {
    width: 25,
    height: 25,
    marginTop: 10,
  },
  headerRightImage: {
    width: 20,
    height: 15,
    marginTop: 14,
  }
};

export default connect(null, { back, openProfile })(SearchBarHeader);
