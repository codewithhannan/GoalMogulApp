import React, { Component } from 'react';
import { View, Text, TabBarIOS, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';

/* Import Icons */
import Icon from '../../asset/icons/like-icon.png';
import IconHome from '../../asset/footer/navigation/home.png';
import IconBell from '../../asset/footer/navigation/bell.png';
import IconGoal from '../../asset/footer/navigation/goal.png';
import IconChat from '../../asset/footer/navigation/chat.png';
import IconStar from '../../asset/footer/navigation/star.png';
import IconMenu from '../../asset/header/menu.png';
import IconHomeLogo from '../../asset/header/home-logo.png';
import Logo from '../../asset/header/logo.png';

import PostCard from '../../components/PostCard';
import TabButtonGroup from '../../components/TabButtonGroup';
import TabButton from '../../components/TabButton';
import GoalFilterBar from '../../components/GoalFilterBar';

import Tabbar from '../Common/TabIcon';

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

  // <SearchBar
  //   lightTheme
  //   round
  //   platform="ios"
  //   placeholder='Search GoalMogul'
  //   placeholderTextColor='#b2b3b4'
  //   containerStyle={styles.searchContainerStyle}
  //   inputStyle={styles.searchInputStyle}
  // />

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
          <Image style={styles.headerLeftImage} source={Logo} />
            <SearchBar
              round
              inputStyle={styles.searchInputStyle}
              containerStyle={styles.searchContainerStyle}
              icon={{ type: 'font-awesome', name: 'search', style: styles.searchIconStyle }}
              placeholder='Search GoalMogul'
            />
          <Image style={styles.headerRightImage} source={IconMenu} />
        </View>

        <TabButtonGroup>
          <TabButton text='GOALS' onSelect />
          <TabButton text='POSTS' />
          <TabButton text='NEEDS' />
        </TabButtonGroup>

        <GoalFilterBar />

        <PostCard key={1}/>
        <PostCard key={2}/>
        {/* 
          <TabBarIOS
            selectedTab={this.state.selectedTab}
            color='#ffffff'
            tintColor='#324a61'
            unselectedItemTintColor='#b8c7cc'
          >
            {children}
          </TabBarIOS>
        */}
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
    borderTopColor: '#ffffff',
    borderBottomColor: '#ffffff',
    padding: 0,
    flex: 4,
    marginRight: 3,
  },
  searchInputStyle: {
    backgroundColor: '#f3f4f6',
    fontSize: 12,
    height: 28
  },
  searchIconStyle: {
    top: 14,
    fontSize: 13
  },
  headerStyle: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerLeftImage: {
    width: 25,
    height: 25,
    marginTop: 10,
  },
  headerRightImage: {
    width: 20,
    height: 15,
    marginTop: 14,
  }
};

export default Home;
