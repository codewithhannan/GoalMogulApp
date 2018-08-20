import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

// Asset
import bulb from '../../../asset/utils/bulb.png';
import forward from '../../../asset/utils/forward.png';
import checkIcon from '../../../asset/utils/check.png';

class SectionCard extends Component {
  render() {
    console.log('item for props is: ', this.props.item);
    const item = this.props.item
      ? this.props.item
      : { description: 'No content', isCompleted: false };
    const { description, isCompleted } = item;
    const sectionText = description === undefined ? 'No content' : description;

    const check = isCompleted ? (
      <View style={styles.checkIconContainerStyle}>
        <Image source={checkIcon} style={styles.checkIconStyle} />
      </View>
    ) : '';

    return (
      <View style={styles.sectionContainerStyle}>
        <View
          style={{
            margin: 12,
            marginTop: 15,
            marginBottom: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {check}
          <View style={styles.textContainerStyle}>
            <Text
              style={styles.sectionTextStyle}
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {sectionText}
            </Text>
          </View>
          <View style={{ flex: 9, flexDirection: 'row' }}>
            <TouchableOpacity style={styles.iconContainerStyle}>
              <Image style={styles.iconStyle} source={bulb} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainerStyle}>
              <Image style={styles.iconStyle} source={forward} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  sectionContainerStyle: {
    marginTop: 0.5,
    marginBottom: 0.5,
    backgroundColor: '#fcfcfc'
  },
  sectionTextStyle: {
    color: '#909090',
    fontSize: 13,
  },
  textContainerStyle: {
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#e5e5e5',
    paddingRight: 10,
    flexShrink: 1,
    flex: 20
  },
  iconContainerStyle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#efefef',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15
  },
  iconStyle: {
    height: 16,
    width: 16,
    borderRadius: 8,
    tintColor: '#a4a7a7'
  },
  checkIconContainerStyle: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#eafcee',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  checkIconStyle: {
    height: 14,
    width: 16,
    borderRadius: 6,
    tintColor: 'black'
  }
};

export default SectionCard;
