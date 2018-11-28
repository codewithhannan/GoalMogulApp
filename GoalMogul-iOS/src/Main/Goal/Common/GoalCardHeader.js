/**
 * This is the header summary text.
 * For NeedCard, Someone requested help from you for a need
 * For GoalCard, Someone shared a goal with you
 */
import React from 'react';
import {
  View,
  Text
} from 'react-native';

const renderText = (item) => {
  const { owner } = item;
  const { boldTextStyle, textStyle } = styles;
  const nameComponent = owner && owner.name
    ? <Text style={{ ...boldTextStyle, ...textStyle }}>{owner.name} </Text>
    : '';

  const goalHeaderText = (
    <Text style={styles.textStyle}>shared a goal with you</Text>
  );

  const needHeaderText = (
    <Text style={styles.textStyle}>requested help from you for a need</Text>
  );

  const headerText = goalHeaderText;

  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
      }}
    >
      <Text
        numberOfLines={1}
        ellipsizeMode='tail'
        style={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 11 }}
      >
        {nameComponent}
        {headerText}
      </Text>
    </View>
  );
};

const GoalCardHeader = (props) => {
  const { item } = props;
  if (!item) return '';

  return (
    <View style={{ marginBottom: 1, backgroundColor: 'white', padding: 5, marginLeft: 7, marginRight: 7 }}>
      {renderText(item)}
    </View>
  );
};

const styles = {
  boldTextStyle: {
    fontWeight: '700'
  },
  textStyle: {
    fontSize: 11
  }
};

export default GoalCardHeader;
