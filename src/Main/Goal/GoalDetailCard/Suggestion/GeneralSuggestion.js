/** @format */

// This component is general suggestion view.
// It includes Link, Reading, Custom with two fields
// suggestionLink and suggestionText
import React from 'react'
import { View, SafeAreaView, Animated } from 'react-native'
import { connect } from 'react-redux'
import { TextField } from 'react-native-material-textfield-gm'

import {
    onSuggestionTextChange,
    onSuggestionLinkChange,
} from '../../../../redux/modules/feed/comment/CommentActions'

import { getNewCommentByTab } from '../../../../redux/modules/feed/comment/CommentSelector'

const MaxHeight = 70

class GeneralSuggestion extends React.Component {
    renderLinkInput(pageId) {
        return (
            // <View style={{ marginBottom: 5, height: MaxHeight }}>
            //   <Text style={styles.headerTextStyle}>Link</Text>
            //   <TextInput
            //     placeholder='Enter the link'
            //     onChangeText={val => this.props.onSuggestionLinkChange(val, pageId)}
            //     style={styles.inputStyle}
            //     maxHeight={MaxHeight}
            //     multiline
            //     autoCapitalize='none'
            //     value={this.props.suggestionLink}
            //   />
            // </View>
            <View style={styles.inputContainerStyle}>
                <TextField
                    label="Link"
                    placeholder="Enter the link"
                    autoCapitalize={false}
                    autoCorrect
                    onChangeText={(val) =>
                        this.props.onSuggestionLinkChange(val, pageId)
                    }
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    value={this.props.suggestionLink}
                />
            </View>
        )
    }

    renderSuggestionText(pageId) {
        return (
            <SafeAreaView>
                {/* <View style={{ marginBottom: 5, height: MaxHeight }}>
          <Text style={styles.headerTextStyle}>Content</Text>
          <TextInput
            placeholder='Enter a suggestion title'
            onChangeText={val => this.props.onSuggestionTextChange(val, pageId)}
            style={styles.inputStyle}
            maxHeight={MaxHeight}
            multiline
            value={this.props.suggestionText}
          />
        </View> */}
                <View style={styles.inputContainerStyle}>
                    <TextField
                        label="Suggestion Title"
                        placeholder="Enter a suggestion title"
                        autoCapitalize
                        autoCorrect
                        onChangeText={(val) =>
                            this.props.onSuggestionTextChange(val, pageId)
                        }
                        returnKeyType="done"
                        clearButtonMode="while-editing"
                        value={this.props.suggestionText}
                    />
                </View>
            </SafeAreaView>
        )
    }

    render() {
        const { pageId, opacity } = this.props
        return (
            <Animated.View style={{ ...styles.containerStyle, opacity }}>
                {this.renderSuggestionText(pageId)}
                {this.renderLinkInput(pageId)}
            </Animated.View>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        margin: 15,
        backgroundColor: 'white',
    },
    headerTextStyle: {
        fontSize: 17,
        fontWeight: '600',
    },
    inputStyle: {
        marginTop: 5,
        padding: 10,
        marginBottom: 5,
        fontSize: 15,
    },
    inputContainerStyle: {
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 5,
    },
}

const mapStateToProps = (state, props) => {
    const { suggestionLink, suggestionText } = getNewCommentByTab(
        state,
        props.pageId
    ).tmpSuggestion

    return {
        suggestionLink,
        suggestionText,
    }
}

export default connect(mapStateToProps, {
    onSuggestionTextChange,
    onSuggestionLinkChange,
})(GeneralSuggestion)
