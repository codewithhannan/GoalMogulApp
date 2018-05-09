import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { connect } from 'react-redux';

/* Components */
import SearchBarHeader from '../Common/SearchBarHeader';
import MeetFilterBar from './MeetFilterBar';
import MeetCard from './MeetCard';

// actions
import { selectTab } from '../../actions';

const Tabs = [
  {
    name: 'SUGGESTED'
  },
  {
    name: 'REQUESTS'
  },
  {
    name: 'FRIENDS'
  },
  {
    name: 'CONTACTS'
  }
];

const testData = [
  {
    data: '1',
    id: '1'
  }
];

class MeetTab extends Component {

  selectTab = id => {
    this.props.selectTab(id);
  }

  keyExtractor = (item) => item.id;

  renderTabs() {
    return Tabs.map((t, index) => {
      // Test selection
      let buttonContainerStyle = { ...styles.buttonContainerStyle };
      let buttonTextStyle = { ...styles.buttonTextStyle };

      if (t.name === this.props.selectedTab) {
        buttonContainerStyle.backgroundColor = '#1379a7';
      } else {
        buttonContainerStyle.backgroundColor = '#1aa0dd';
      }
      return (
        <View style={buttonContainerStyle} key={index}>
          <TouchableOpacity onPress={this.selectTab(t.name)}>
            <Text style={buttonTextStyle}>{t.name}</Text>
          </TouchableOpacity>
        </View>
      );
    });
  }

  renderItem = ({ item }) => {
    return <MeetCard />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchBarHeader rightIcon='menu' />
        <View>
          <ScrollView horizontal>
            {this.renderTabs()}
          </ScrollView>
        </View>

        <MeetFilterBar />
        <View style={{ flex: 1 }}>
          <FlatList
            data={testData}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        </View>
      </View>
    );
  }
}


const styles = {
  buttonContainerStyle: {

  },
  buttonTextStyle: {
    color: '#ffffff',
    padding: 10,
    fontWeight: '700'
  }
};


const mapStateToProps = state => {
  const { selectedTab } = state.meet;

  return {
    selectedTab
  };
};

export default connect(mapStateToProps, { selectTab })(MeetTab);
