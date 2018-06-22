import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';

// Asset
import bulb from '../../../asset/utils/bulb.png';
import forward from '../../../asset/utils/forward.png';

const SectionCard = (props) => {
  return (
    <View style={styles.sectionContainerStyle}>
      <View
        style={{
          margin: 15,
          marginTop: 20,
          marginBottom: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View style={styles.textContainerStyle}>
          <Text
            style={styles.sectionTextStyle}
            numberOfLines={3}
            ellipsizeMode='tail'
          >
            Introduction to someone from Bill and Melinda Gates foundation
          </Text>
        </View>
        <TouchableOpacity style={styles.iconContainerStyle}>
          <Image style={styles.iconStyle} source={bulb} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconContainerStyle}>
          <Image style={styles.iconStyle} source={forward} />
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = {
  sectionContainerStyle: {
    marginTop: 0.5,
    marginBottom: 0.5,
    backgroundColor: '#fcfcfc'
  },
  sectionTextStyle: {
    color: '#909090',
    fontSize: 14,
  },
  textContainerStyle: {
    flexDirection: 'row',
    borderRightWidth: 0.5,
    borderColor: '#e5e5e5',
    paddingRight: 10,
    flexShrink: 1
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
  }
};

export default SectionCard;
