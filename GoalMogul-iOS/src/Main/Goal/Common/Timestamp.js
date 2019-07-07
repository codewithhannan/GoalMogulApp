import React from 'react';
import { Image, Text, View } from 'react-native';
import Icons from '../../../asset/base64/Icons';
import { DotIcon } from '../../../Utils/Icons';


const { ViewCountIcon } = Icons;

const Timestamp = (props) => {
  // TODO: format time
  const { time, viewCount, priority } = props;
  const viewCountComponent = viewCount ? (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <DotIcon iconStyle={{ tintColor: '#818181', width: 3, height: 3, marginLeft: 4, marginRight: 5, marginTop: 1 }} />
      <Image source={ViewCountIcon} style={{ height: 7, width: 11, marginTop: 1, tintColor: '#636363' }}/>
      <Text style={{ fontSize: 10, color: '#636363', marginLeft: 3 }}>{viewCount}</Text>
    </View>
  ) : null;

  let priorityText;
  if (priority) {
    if (priority <= 3) {
      priorityText = 'Low';
    } else if (priority <= 6) {
      priorityText = 'Medium';
    } else {
      priorityText = 'High';
    }
  }
  const priorityComponent = priorityText ? (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <DotIcon iconStyle={{ tintColor: '#818181', width: 3, height: 3, marginLeft: 4, marginRight: 5, marginTop: 1 }} />
      <Text style={{ fontSize: 10, color: '#636363' }}>{priorityText}</Text>
    </View>
  ) : null;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.containerStyle}>
        {time}
      </Text>
      {priorityComponent}
      {viewCountComponent}
    </View>
    
  );
};

const styles = {
  containerStyle: {
    fontSize: 10,
    color: '#636363'
  }
};

export default Timestamp;
