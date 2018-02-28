import React, { Component } from 'react';
import { View, Text, TabBarIOS, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

/* Import Icons */
import Icon from './asset/icons/like-icon.png';
import IconHome from './asset/footer/navigation/home.png';
import IconBell from './asset/footer/navigation/bell.png';
import IconGoal from './asset/footer/navigation/goal.png';
import IconChat from './asset/footer/navigation/chat.png';
import IconStar from './asset/footer/navigation/star.png';
import IconMenu from './asset/header/menu.png';
import IconHomeLogo from './asset/header/home-logo.png';

import PostCard from './components/PostCard';


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: [
        {
          key: 'home',
          title: '',
          icon: IconHome
        },
        {
          key: 'goals',
          title: '',
          icon: IconGoal
        },
        {
          key: 'notification',
          title: '',
          icon: IconBell
        },
        {
          key: 'explore',
          title: '',
          icon: IconStar
        },
        {
          key: 'chat',
          title: '',
          icon: IconChat
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
          <Image style={styles.headerImage} source={IconHomeLogo} />
          <SearchBar
            round
            platform="ios"
            placeholder='Search GoalMogul'
            placeholderTextColor='#b2b3b4'
            containerStyle={styles.searchContainerStyle}
            inputStyle={styles.searchInputStyle}
          />
          <Image style={styles.headerImage} source={IconMenu} />
        </View>
        <PostCard />
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
    borderTopColor: '#ffffff',
    flex: 5
  },
  searchInputStyle: {
    backgroundColor: '#f3f4f6'
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerImage: {
    paddingTop: 32,
    marginTop: 8,
  }
};

export default Home;
