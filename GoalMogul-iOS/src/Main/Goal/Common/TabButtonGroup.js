import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import TabButton from './TabButton';

class TabButtonGroup extends Component {

  renderTabs() {
    const { buttons, tabIconMap } = this.props;
    const { navigationState, jumpToIndex } = buttons;
    const { index, routes } = navigationState;

    return routes.map((b, i) => {
      const selected = index === i;
      const iconSource = tabIconMap ? tabIconMap[b.key].iconSource : undefined;
      const iconStyle = tabIconMap ? tabIconMap[b.key].iconStyle : undefined;

      return (
        <TabButton
          key={b.key}
          text={b.title}
          selected={selected}
          onPress={jumpToIndex.bind(this, i)}
          count={10}
          iconSource={iconSource}
          iconStyle={iconStyle}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderTabs()}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    height: 38,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 0.5,
    marginBottom: 0.5,
    backgroundColor: 'white'
  }
};

export default TabButtonGroup;
