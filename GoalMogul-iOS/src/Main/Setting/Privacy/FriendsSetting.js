import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';

/* Components */
import SearchBarHeader from '../../Common/SearchBarHeader';

/* Styles */
import Styles from '../Styles';

/* Actions */
import {
  onFriendsSettingSelection,
  updateFriendsSetting
} from '../../../actions';

/*
  TODO: export this const file
*/
const friendsSettingList = [
  {
    title: 'Public',
    explanation: "Everyone can see who I'm friends with"
  },
  {
    title: 'Mutual',
    explanation: 'Anyone can see the friends we have in common'
  },
  {
    title: 'Friends',
    explanation: "Friends can see who I'm friend with"
  },
  {
    title: 'Private',
    explanation: "Only I know who I'm friend with"
  }
];

class FriendsSetting extends Component {

  handleOnSelectedPress(id) {
    this.props.onFriendsSettingSelection(id);
  }

  renderTick(info) {
    if (info.title === this.props.privacy.friends) {
      return (
        <View style={{ height: 15, width: 20 }} >
          <Icon
            type='entypo'
            name='check'
          />
        </View>
      );
    }
  }

  renderPrivacySettingDetail() {
    return friendsSettingList.map((info) => {
      return (
        <TouchableOpacity onPress={this.handleOnSelectedPress.bind(this, info.title)}>
          <View style={styles.sectionContainerStyle}>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleTextStyle}>
                {info.title}
              </Text>
              <Text style={styles.explanationStyle}>
                {info.explanation}
              </Text>
            </View>
            {this.renderTick(info)}
          </View>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader
          backButton
          rightIcon='empty'
          title="Friends"
          onBackPress={() => this.props.updateFriendsSetting()}
        />
        <View style={Styles.titleSectionStyle}>
          <Text style={Styles.titleTextStyle}>
            Who can see your friends
          </Text>
        </View>
        <View style={Styles.detailCardSection}>
          {this.renderPrivacySettingDetail()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { privacy } = state.setting;

  return {
    privacy
  };
};

const styles = {
  sectionContainerStyle: {
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleTextStyle: {
    fontSize: 14,
    fontWeight: '700'
  },
  explanationStyle: {
    fontSize: 13,
    color: '#4d525b'
  }
};

export default connect(
  mapStateToProps, {
    onFriendsSettingSelection,
    updateFriendsSetting
  })(FriendsSetting);
