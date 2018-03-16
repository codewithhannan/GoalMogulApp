import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';

const Pagination = (props) => {
  const { total, current } = props;

  let pagination = [];

  for (let i = 0; i < total; i = i + 1) {
    let color = '';
    if (i <= current) {
      color = '#ffffff';
    } else {
      color = '#2ea1b8';
    }
    pagination.push(
      <Icon
        name='primitive-dot'
        type='octicon'
        color={color}
        size={21}
        containerStyle={styles.iconContainerStyle}
      />
    );
  }

  return (
    <View style={styles.containerStyle}>
      {pagination}
    </View>
  );
};

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7
  },
  iconContainerStyle: {
    alignSelf: 'center',
    width: 11,
    marginLeft: 8,
    marginRight: 8
  }
};

export default Pagination;
