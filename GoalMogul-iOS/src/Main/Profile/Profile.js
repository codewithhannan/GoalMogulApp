import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';

/* Components */
import MyGoalCard from '../Common/MyGoalCard';
import SearchBarHeader from '../Common/SearchBarHeader';
import ProfileSummaryCard from './ProfileSummaryCard';
import FilterBarButton from '../Common/Button/FilterBarButton';
import GoalFilterBar from '../Common/GoalFilterBar';

const testData = {
  goal: {
    text: 'MY GOALS',
    number: '10'
  },
  post: {
    text: 'MY POSTS',
    number: '2'
  },
  need: {
    text: 'MY NEEDS',
    number: '21'
  }
};

class Profile extends Component {
  render() {
    return (
      <MenuProvider>
        <View style={styles.containerStyle}>
          <SearchBarHeader backButton rightIcon='menu' />
          <ProfileSummaryCard />
          <View style={styles.tabContainerStyle}>
            <FilterBarButton data={testData.goal} />
            <FilterBarButton data={testData.post} />
            <FilterBarButton data={testData.need} />
          </View>
          <GoalFilterBar />
          <ScrollView>
            <MyGoalCard />
          </ScrollView>
        </View>
      </MenuProvider>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1
  },
  tabContainerStyle: {
    display: 'flex',
    height: 35,
    flexDirection: 'row',
  }
};

export default Profile;
