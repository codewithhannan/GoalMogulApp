import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';

// Assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import next from '../../../asset/utils/next.png';

// Actions
import { selectTribe } from '../../../redux/modules/feed/post/ShareActions';
import {
  tribeDetailOpen
} from '../../../redux/modules/tribe/TribeActions';
import DelayedButton from '../../Common/Button/DelayedButton';

const DEBUG_KEY = '[ Component SearchTribeCard ]';

class SearchTribeCard extends Component {
  state = {
    imageLoading: false
  }

  /**
   * @param type: ['GeneralSearch', 'SearchSuggestion']
   * @param item: search result item
   */
  onButtonClicked = (item, type) => {
    const { onItemSelect, selectTribe, tribeDetailOpen } = this.props;
    if (!type || type === 'SearchSuggestion') {
      console.log(`${DEBUG_KEY} select tribe: `, item);

      // This is passed in through EventSearchOverlay. It is initially used by ChatRoomConversation
      if (onItemSelect) {
        onItemSelect(item._id);
        return;
      }

      selectTribe(item, this.props.callback);
      return;
    }

    if (type === 'GeneralSearch') {
      console.log('open tribe detail with type GeneralSearch');
      tribeDetailOpen(item);
      return;
    }
  }

  renderTribeImage() {
    const { picture } = this.props.item;
    let tribeImage = <Image style={styles.imageStyle} source={defaultUserProfile} />;
    if (picture) {
      const imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${picture}`;
      tribeImage =
      (
        <View>
          <Image
            onLoadStart={() => this.setState({ imageLoading: true })}
            onLoadEnd={() => this.setState({ imageLoading: false })}
            style={styles.imageStyle}
            source={{ uri: imageUrl }}
          />
          {
            this.state.imageLoading ?
            <View style={{ ...styles.imageStyle, alignItems: 'center', justifyContent: 'center' }}>
               <ActivityIndicator size="large" color="lightgray" />
            </View>
            : null
          }
        </View>

      );
    }
    return tribeImage;
  }

  renderButton(item, type) {
    return (
      <View style={styles.iconContainerStyle}>
        <DelayedButton activeOpacity={0.6}
          onPress={() => this.onButtonClicked(item, type)}
          style={{ padding: 15 }}
        >
          <Image
            source={next}
            style={{ ...styles.iconStyle, opacity: 0.8 }}
          />
        </DelayedButton>
      </View>
    );
  }

  renderInfo() {
    const { name } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <Name text={name} textStyle={{ color: '#4F4F4F' }} />
      </View>
    );
  }

  renderOccupation() {
    const { description } = this.props.item;
    if (description) {
      return (
        <Text
          style={styles.titleTextStyle}
          numberOfLines={1}
          ellipsizeMode='tail'
        >
          <Text style={styles.detailTextStyle}>{description}</Text>
        </Text>
      );
    }
    return null;
  }

  render() {
    const { item, type } = this.props;
    const { _id } = this.props.item;
    return (
      <DelayedButton activeOpacity={0.6}>
        <View style={styles.containerStyle}>
          {this.renderTribeImage()}

          <View style={styles.bodyContainerStyle}>
            {this.renderInfo()}
            {this.renderOccupation()}
          </View>
          {this.renderButton(item, type)}
        </View>
      </DelayedButton>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 4,
    marginRight: 4,
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    shadowColor: 'gray',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bodyContainerStyle: {
    marginLeft: 8,
    flex: 1,
  },
  infoContainerStyle: {
    flexDirection: 'row',
    height: 25,
  },
  imageStyle: {
    height: 48,
    width: 48,
    borderRadius: 5,
  },
  titleTextStyle: {
    color: '#17B3EC',
    fontSize: 11,
    paddingTop: 1,
    paddingBottom: 1
  },
  detailTextStyle: {
    color: '#9B9B9B',
    paddingLeft: 3,
    fontFamily: 'gotham-pro',
  },
  iconContainerStyle: {
    marginLeft: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  iconStyle: {
    height: 25,
    width: 26,
    transform: [{ rotateY: '180deg' }],
    tintColor: '#17B3EC'
  }
};

export default connect(null, {
  selectTribe,
  tribeDetailOpen
})(SearchTribeCard);
