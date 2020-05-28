import React from 'react';
import {
    View,
    FlatList,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers,
    MenuProvider
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
import { BACKGROUND_COLOR } from '../../../styles';
import ModalHeader from '../../Common/Header/ModalHeader';
import { Actions } from 'react-native-router-flux';

const DEBUG_KEY = '[ UI TrendingGOalView ]';
const { Popover } = renderers;
const { width } = Dimensions.get('window');

class TrendingGoalView extends React.PureComponent {
    componentDidMount() {
        console.log(`${DEBUG_KEY}: component did mount`);
    }

    keyExtractor = (item) => item.title;

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
        return <TrendingGoalCardView index={index + 1} item={item} />;
    }

    render() {
        const { refreshing, loading, category } = this.props;
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <ModalHeader
                    title="Treading Goals"
                    back
                    onCancel={() => {
                        if (this.props.onClose) this.props.onClose();
                        Actions.pop();
                    }}
                />
                <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
                    <FilterBar 
                        handleOnMenuSelect={(val) => this.handleOnMenuSelect(val)} 
                        category={category} 
                    />
                    <FlatList
                        data={this.props.data}
                        renderItem={this.renderItem}
                        numColumns={1}
                        keyExtractor={this.keyExtractor}
                        refreshing={refreshing}
                        onRefresh={this.handleOnRefresh}
                        onEndReached={this.handleOnLoadMore}
                        ListEmptyComponent={
                            loading || refreshing ? null :
                            <EmptyResult text={'No Trending'} textStyle={{ paddingTop: 150 }} />
                        }
                        onEndThreshold={0}
                        ListFooterComponent={
                            loading 
                            ? (
                                <View
                                    style={{ flex: 1, height: 50, width, justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <ActivityIndicator />
                                </View>
                            ) : null
                        }
                    />
                </View>
            </MenuProvider>
        );
    }
}

const styles = {
    backdrop: {
        backgroundColor: 'transparent'
    },
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

const options = [
    'All', 'General', 'Learning/Education', 'Career/Business', 'Financial', 'Spiritual',
    'Family/Personal', 'Physical', 'Charity/Philanthropy', 'Things'
];

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
                <FlatList
                    data={options}
                    renderItem={({ item }) => (
                        <MenuOption value={item} text={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ height: 200 }}
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
