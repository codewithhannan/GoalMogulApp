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

const DEBUG_KEY = '[ Component SearchTribeCard ]';

class SearchTribeCard extends Component {
  state = {
    imageLoading: false
  }

  onButtonClicked = (item) => {
    console.log(`${DEBUG_KEY} select tribe: `, item);
    this.props.selectTribe(item);
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
            : ''
          }
        </View>

      );
    }
    return tribeImage;
  }

  renderButton(item) {
    return (
      <View style={styles.iconContainerStyle}>
        <TouchableOpacity
          onPress={this.onButtonClicked.bind(this, item)}
          style={{ padding: 15 }}
        >
          <Image
            source={next}
            style={styles.iconStyle}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderInfo() {
    const { title } = this.props.item;
    return (
      <View style={styles.infoContainerStyle}>
        <Name text={title} textStyle={{ color: '#4F4F4F' }} />
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
    return '';
  }

  render() {
    const { item } = this.props;
    const { _id } = this.props.item;
    return (
      <TouchableOpacity>
        <View style={styles.containerStyle}>
          {this.renderTribeImage()}

          <View style={styles.bodyContainerStyle}>
            {this.renderInfo()}
            {this.renderOccupation()}
          </View>
          {this.renderButton(item)}
        </View>
      </TouchableOpacity>
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
    color: '#45C9F6',
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
    tintColor: '#45C9F6'
  }
};

export default connect(null, {
  selectTribe
})(SearchTribeCard);
