import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu';

// Components
import TrendingGoalCardView from './TrendingGoalCardView';
import EmptyResult from '../../Common/Text/EmptyResult';

// Actions
import {
    selectTrendingGoalsCategory,
    refreshTrendingGoals,
    loadMoreTrendingGoals
} from '../../../redux/modules/goal/CreateGoalActions';

// Assets
import dropDown from '../../../asset/utils/dropDown.png';

const DEBUG_KEY = '[ UI TrendingGOalView ]';
const { Popover } = renderers;
const { width } = Dimensions.get('window');

class TrendingGoalView extends React.PureComponent {
    componentDidMount() {
        console.log(`${DEBUG_KEY}: component did mount`);
    }

    keyExtractor = (item) => item._id;

    handleOnRefresh = () => {
        this.props.refreshTrendingGoals();
    }

    handleOnLoadMore = () => {
        this.props.loadMoreTrendingGoals();
    }

    handleOnMenuSelect = (value) => {
        this.props.selectTrendingGoalsCategory(value);
    }

    renderItem = ({ item, index }) => {
        console.log(`${DEBUG_KEY}: index is: `, index);
        return <TrendingGoalCardView index={index} item={item} />;
    }

    render() {
        const { refreshing, loading, category } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <FilterBar handleOnMenuSelect={(val) => this.handleOnMenuSelect(val)} category={category} />
                <FlatList
                    data={this.props.data}
                    renderItem={this.renderItem}
                    numColumns={1}
                    keyExtractor={this.keyExtractor}
                    refreshing={refreshing}
                    onRefresh={this.handleOnRefresh}
                    onEndReached={this.handleOnLoadMore}
                    ListEmptyComponent={
                        loading || refreshing ? '' :
                        <EmptyResult text={'No Trending'} textStyle={{ paddingTop: 150 }} />
                    }
                    onEndThreshold={0}
                />
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        marginLeft: 5,
        marginRight: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        marginLeft: 15,
        paddingTop: 12,
        paddingBottom: 12
    },
    textStyle: {
        fontSize: 10,
        // color: '#1fb6dd',
        color: '#696969',
        fontWeight: '600',
      },
      caretStyle: {
        // tintColor: '#20485f',
        tintColor: '#696969',
        marginLeft: 5
      },
      anchorStyle: {
        backgroundColor: 'white'
      },
      menuOptionsStyles: {
        optionsContainer: {
          width: width - 14,
        },
        optionsWrapper: {
    
        },
        optionWrapper: {
          flex: 1,
        },
        optionTouchable: {
          underlayColor: 'lightgray',
          activeOpacity: 10,
        },
        optionText: {
          paddingTop: 5,
          paddingBottom: 5,
          paddingLeft: 10,
          paddingRight: 10,
          color: 'black',
        },
      }
};

const FilterBar = (props) => {
    const { category, handleOnMenuSelect } = props;
    const categoryText = category ? ` (${category})` : '';

    return (
        <Menu
          onSelect={value => handleOnMenuSelect(value)}
          rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
          renderer={Popover}
        >
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          >
            <View style={styles.detailContainerStyle}>
              <Text style={styles.textStyle}>Category{categoryText}</Text>
              <Image style={styles.caretStyle} source={dropDown} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={styles.menuOptionsStyles}>
            <MenuOption
              text='Date Created'
              value='created'
            />
            <MenuOption
              text='Last Updated'
              value='updated'
            />
            <MenuOption
              text='Date Shared'
              value='shared'
            />
            <MenuOption
              text='Priority'
              value='priority'
            />

          </MenuOptions>
        </Menu>
    );
};

const mapStateToProps = state => {
    const { trendingGoals } = state.createGoal;
    const { data, refreshing, loading, category } = trendingGoals;

    return {
        data,
        refreshing,
        loading,
        category
    };
};

export default connect(
    mapStateToProps,
    {
        selectTrendingGoalsCategory,
        refreshTrendingGoals,
        loadMoreTrendingGoals
    }
)(TrendingGoalView);
