import React, { Component } from 'react';
import { View, Text, TabBarIOS } from 'react-native';

/* Import Icons */
import Icon from '../../asset/icons/like-icon.png';
import IconHome from '../../asset/footer/navigation/home.png';
import IconBell from '../../asset/footer/navigation/bell.png';
import IconGoal from '../../asset/footer/navigation/goal.png';
import IconChat from '../../asset/footer/navigation/chat.png';
import IconStar from '../../asset/footer/navigation/star.png';

/* Components */
import PostCard from '../../components/PostCard';
import TabButtonGroup from '../Common/TabButtonGroup';
import TabButton from '../Common/Button/TabButton';
import GoalFilterBar from '../Common/GoalFilterBar';
import SearchBarHeader from '../Common/SearchBarHeader';
//TODO: delete following imports
import MyGoalCard from '../Common/MyGoalCard';

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
    /*
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
    */

    return (
      <View style={styles.homeContainerStyle}>
        <SearchBarHeader />

        <TabButtonGroup>
          <TabButton text='GOALS' onSelect />
          <TabButton text='POSTS' />
          <TabButton text='NEEDS' />
        </TabButtonGroup>

        <GoalFilterBar />

        <PostCard key={1} />
        <PostCard key={2} />
        <MyGoalCard key={3} />
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
  }
};

export default Home;
