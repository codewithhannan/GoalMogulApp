import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";

// Components
import SearchUserCard from "./SearchUserCard";
import EmptyResult from "../../Common/Text/EmptyResult";

// actions
import {
  refreshSearchResult,
  onLoadMore,
} from "../../../redux/modules/search/SearchActions";

// tab key
const key = "people";
const DEBUG_KEY = "[ Component PeopleSearch ]";

class PeopleSearch extends Component {
  _keyExtractor = (item) => item._id;

  handleRefresh = () => {
    console.log(`${DEBUG_KEY} Refreshing tab: `, key);
    // Only refresh if there is content
    if (this.props.searchContent && this.props.searchContent.trim() !== "") {
      this.props.refreshSearchResult(key);
    }
  };

  handleOnLoadMore = () => {
    console.log(`${DEBUG_KEY} Loading more for tab: `, key);
    this.props.onLoadMore(key);
  };

  renderItem = ({ item }) => {
    return (
      <SearchUserCard
        {...this.props}
        item={item}
        onSelect={this.props.onSelect}
        type={this.props.type}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.props.data.length === 0 &&
        this.props.searchContent &&
        !this.props.loading ? (
          <EmptyResult text={"No Results"} />
        ) : (
          <FlatList
            data={this.props.data}
            renderItem={this.renderItem}
            keyExtractor={this._keyExtractor}
            onEndReached={this.handleOnLoadMore}
            onEndReachedThreshold={0.5}
            onRefresh={this.handleRefresh}
            refreshing={this.props.loading}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { people, searchContent } = state.search;
  const { data, refreshing, loading } = people;

  return {
    people,
    data,
    refreshing,
    loading,
    searchContent,
  };
};

export default connect(mapStateToProps, {
  refreshSearchResult,
  onLoadMore,
})(PeopleSearch);
