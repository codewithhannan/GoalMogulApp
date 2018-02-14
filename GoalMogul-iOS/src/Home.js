import React, { Component } from 'react';
import { View, Text, TabBarIOS, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Icon from './asset/icons/like-icon.png';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: [
        {
          key: 'home',
          title: '',
          icon: Icon
        },
        {
          key: 'friends',
          title: '',
          icon: Icon
        },
        {
          key: 'notification',
          title: '',
          icon: Icon
        },
        {
          key: 'explore',
          title: '',
          icon: Icon
        },
        {
          key: 'chat',
          title: '',
          icon: Icon
        },
      ],
      selectedTab: 0
    };
  }

  render() {
    const children = this.state.navigation.map((tab, i) => {
     return (
      <TabBarIOS.Item
        key={tab.key}
        icon={tab.icon}
        selectedIcon={tab.selectedIcon}
        title={tab.title}
        onPress={() => this.setState({
            selectedTab: i
        })}
        selected={this.state.selectedTab === i}
      >
        <Text>Page {i}</Text>
       </TabBarIOS.Item>
     );
   });
    return (
      <View style={styles.homeContainerStyle}>
        <View style={styles.headerStyle}>
          <Image style={styles.headerImage} source={Icon} />
          <SearchBar
            round
            platform="ios"
            placeholder='Search GoalMogul'
            placeholderTextColor='#b2b3b4'
            containerStyle={styles.searchContainerStyle}
            inputStyle={styles.searchInputStyle}
          />
          <Image style={styles.headerImage} source={Icon} />
        </View>
        <TabBarIOS
          selectedTab={this.state.selectedTab}
          color='#ffffff'
        >
          {children}
        </TabBarIOS>
      </View>
    );
  }
}

const styles = {
  homeContainerStyle: {
    backgroundColor: '#f3f4f6',
    flex: 1
  },
  searchContainerStyle: {
    backgroundColor: '#ffffff',
    borderBottomColor: '#ffffff',
    borderTopColor: '#ffffff'
  },
  searchInputStyle: {
    backgroundColor: '#f3f4f6'
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 30
  },
  headerImage: {
    marginTop: 8
  }
};

export default Home;
