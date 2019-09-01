import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { connect } from 'react-redux';

// Components
import Name from '../../Common/Name';

// Assets
import tribe_default_icon from '../../../asset/utils/tribeIcon.png';
import next from '../../../asset/utils/next.png';

// Actions
import { selectTribe } from '../../../redux/modules/feed/post/ShareActions';
import {
  tribeDetailOpen
} from '../../../redux/modules/tribe/TribeActions';
import DelayedButton from '../../Common/Button/DelayedButton';
import ProfileImage from '../../Common/ProfileImage';

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
		return (
			<ProfileImage
				imageStyle={{ height: 55, width: 55, borderRadius: 5 }}
				imageUrl={picture}
				rounded
				imageContainerStyle={styles.imageContainerStyle}
        defaultUserProfile={tribe_default_icon}
			/>
		);
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
      <DelayedButton 
        activeOpacity={0.6}
        onPress={() => this.onButtonClicked(item, type)}
      >
        <View style={styles.containerStyle}>
          {this.renderTribeImage()}

          <View style={styles.bodyContainerStyle}>
            {this.renderInfo()}
            {this.renderOccupation()}
          </View>
          {/* {this.renderButton(item, type)} */}
        </View>
      </DelayedButton>
    );
  }
}

const styles = {
  containerStyle: {
    flexDirection: 'row',
    marginTop: 1,
    paddingLeft: 12,
		paddingRight: 12,
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
  },
  imageContainerStyle: {
		borderWidth: 0.5,
		padding: 1.5,
		borderColor: 'lightgray',
		alignItems: 'center',
		borderRadius: 6,
		alignSelf: 'center',
		backgroundColor: 'white'
	},
};

export default connect(null, {
  selectTribe,
  tribeDetailOpen
})(SearchTribeCard);
