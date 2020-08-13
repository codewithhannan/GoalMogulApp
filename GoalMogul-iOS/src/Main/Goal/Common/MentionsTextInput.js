/** @format */

import React, { Component } from 'react'
import {
    Text,
    View,
    Animated,
    TextInput,
    FlatList,
    ViewPropTypes,
} from 'react-native'
import PropTypes from 'prop-types'
import _ from 'lodash'

const DEBUG_KEY = '[ UI MentionsTextInput ]'

export default class MentionsTextInput extends Component {
    constructor() {
        super()
        this.state = {
            isTrackingStarted: false,
            suggestionRowHeight: new Animated.Value(0),
        }
        this.isTrackingStarted = false
        this.previousChar = ' '
        this.cursorPosition = 0
    }

    componentDidMount() {
        if (this.props.onRef) this.props.onRef(this)
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.value) {
            this.resetTextbox()
        } else if (
            this.isTrackingStarted &&
            !nextProps.horizontal &&
            nextProps.suggestionsData.length !== 0
        ) {
            const numOfRows =
                nextProps.MaxVisibleRowCount >= nextProps.suggestionsData.length
                    ? nextProps.suggestionsData.length
                    : nextProps.MaxVisibleRowCount
            const height = numOfRows * nextProps.suggestionRowHeight
            this.openSuggestionsPanel(height)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Check if last deleted is a trigger (@), if so, then update the tags
        // console.log(`${DEBUG_KEY}: componentDidUpdate`);
        this.checkTriggerDeleted(prevProps)

        // Check if new tagSearchRes matches

        const prevContentTagsReg = prevProps.contentTagsReg
        const nextContentTagsReg = this.props.contentTagsReg
        if (!_.isEqual(prevContentTagsReg.sort(), nextContentTagsReg.sort())) {
            // Update the tags to match
        }
    }

    onChangeText(val) {
        this.props.onChangeText(val) // pass changed text back
        // TODO: Update the logic to start tracking
        const lastChar = val.substr(val.length - 1) // This is the char at the end of the content
        const wordBoundry =
            this.props.triggerLocation === 'new-word-only'
                ? this.previousChar.trim().length === 0
                : true

        const curInputChar = val.slice(
            this.cursorPosition - 1,
            this.cursorPosition
        )
        const prevInputChar = val.slice(
            this.cursorPosition - 2,
            this.cursorPosition - 1
        )
        const nextCharChar = val.slice(
            this.cursorPosition,
            this.cursorPosition + 1
        )
        // Or the cursor is at one of the tags
        if (
            (lastChar === this.props.trigger && wordBoundry) ||
            this.checkIfOnLastTag(val) ||
            (curInputChar === this.props.trigger &&
                prevInputChar.trim().length === 0 &&
                nextCharChar.trim().length === 0) ||
            this.checkIfOnTag(val)
        ) {
            // console.log(`${DEBUG_KEY}: start tracking`);
            this.startTracking()
            // } else if (val === "" || (lastChar === ' ' && this.state.isTrackingStarted)) {
            // (lastChar === ' ' && this.state.isTrackingStarted) is moved to identifyKeyword
            // to determine if we want to stop tracking
        } else if (val === '') {
            this.stopTracking()
        }
        this.previousChar = lastChar
        this.identifyKeyword(val)
    }

    // Check if the last group is a tag.
    checkIfOnLastTag(val) {
        const { contentTags } = this.props
        const lastTriggerIndex = val.lastIndexOf(this.props.trigger)
        const lastTag = val.slice(lastTriggerIndex)

        return contentTags.some((tag) => {
            return (
                tag.tagText === lastTag && tag.startIndex === lastTriggerIndex
            )
        })
    }

    checkIfOnTag(val) {
        const { contentTags } = this.props

        const focusContent = val.slice(0, this.cursorPosition)
        const lastFocucsTriggerIndex = focusContent.lastIndexOf(
            this.props.trigger
        )
        const lastFocusTag = focusContent.slice(lastFocucsTriggerIndex)

        // console.log(`${DEBUG_KEY}: lastTag:`, lastTag);
        // console.log(`${DEBUG_KEY}: lastTag:`, 1);
        return contentTags.some((tag) => {
            // console.log(`${DEBUG_KEY}: lastTriggerIndex: ${lastTriggerIndex} vs tag: ${tag.startIndex}`);
            // console.log(`${DEBUG_KEY}: lastTag: ${lastTag} vs tag: ${tag.tagText}`);
            return (
                tag.tagText.slice(0, tag.tagText.length - 1) === lastFocusTag &&
                tag.startIndex === lastFocucsTriggerIndex
            )
        })
    }

    // If last deleted is trigger, user callback to clear the content tags and
    // Content tags reg
    checkTriggerDeleted(prevProps) {
        const prevVal = prevProps.value
        const curVal = this.props.value
        if (
            prevVal &&
            !!prevVal.length &&
            curVal &&
            prevVal.length > curVal.length &&
            prevVal[prevVal.length - 1] === '@'
        ) {
            this.props.validateTags()
        }
    }

    updateSuggestions(lastKeyword, cursorPosition) {
        this.props.triggerCallback(lastKeyword, cursorPosition)
    }

    identifyKeyword(val) {
        if (this.isTrackingStarted) {
            const boundary =
                this.props.triggerLocation === 'new-word-only' ? 'B' : ''
            // focusContent is the content before the cursor
            const focusContent = val.slice(0, this.cursorPosition)
            const lastFocucsTriggerIndex = focusContent.lastIndexOf(
                this.props.trigger
            )
            const lastFocusTag = focusContent.slice(lastFocucsTriggerIndex)
            const lastFocusKW = lastFocusTag.slice(1) // "@Jia Zeng" --> "Jia Zeng"
            const focusContentHasMoreThan2Spaces =
                lastFocusTag.split(' ').length - 1 >= 2
            let focusContentHasMatch
            this.props.tagSearchRes.forEach((res) => {
                if (res.name.includes(lastFocusKW)) focusContentHasMatch = true
            })
            if (focusContentHasMoreThan2Spaces && !focusContentHasMatch) {
                this.stopTracking()
            }

            let tagsReg = ''
            this.props.contentTagsReg.forEach((reg) => {
                tagsReg = `${reg}|${tagsReg}`
            })
            const pattern = new RegExp(
                `${tagsReg}` +
                    // Find the match for @Jia Zeng, name with spaces
                    `\\${boundary}${this.props.trigger}\\w+\\s\\w+|` +
                    `\\${boundary}${this.props.trigger}\\w+\\s|` +
                    `\\${boundary}${this.props.trigger}[a-z0-9_-]+|` +
                    `\\${boundary}${this.props.trigger}`,
                `gi`
            )
            const keywordArray = focusContent.match(pattern)

            if (keywordArray && !!keywordArray.length) {
                const lastKeyword = keywordArray[keywordArray.length - 1]
                this.updateSuggestions(lastKeyword, this.cursorPosition)
            }
        }
    }

    openSuggestionsPanel(height) {
        Animated.timing(this.state.suggestionRowHeight, {
            toValue: height ? height : this.props.suggestionRowHeight,
            duration: 100,
        }).start()
    }

    handleOnSelectionChange(event) {
        const { start, end } = event.nativeEvent.selection
        if (start === end) this.cursorPosition = start
    }

    closeSuggestionsPanel() {
        Animated.timing(this.state.suggestionRowHeight, {
            toValue: 0,
            duration: 100,
        }).start()
    }

    startTracking() {
        this.isTrackingStarted = true
        this.openSuggestionsPanel()
        this.setState({
            isTrackingStarted: true,
        })
    }

    stopTracking() {
        this.isTrackingStarted = false
        this.closeSuggestionsPanel()
        this.setState({
            isTrackingStarted: false,
        })
    }

    resetTextbox() {
        this.previousChar = ' '
        this.stopTracking()
    }

    focus() {
        if (this._textInput) this._textInput.focus()
    }

    renderItemSeparator = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: 0.5,
                    backgroundColor: 'lightgray',
                }}
            />
        )
    }

    renderTextInput() {
        if (
            this.props.flexGrowDirection &&
            this.props.flexGrowDirection === 'bottom'
        ) {
            return (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {this.props.renderLeftIcons
                        ? this.props.renderLeftIcons()
                        : null}
                    <View
                        style={{
                            flex: 1,
                            ...this.props.textInputContainerStyle,
                        }}
                    >
                        <TextInput
                            {...this.props}
                            ref={(component) => (this._textInput = component)}
                            onChangeText={this.onChangeText.bind(this)}
                            multiline
                            value={this.props.value}
                            style={[this.props.textInputStyle]}
                            onSelectionChange={this.handleOnSelectionChange.bind(
                                this
                            )}
                            placeholder={
                                this.props.placeholder
                                    ? this.props.placeholder
                                    : 'Write a comment...'
                            }
                        />
                    </View>
                    {this.props.renderPost ? this.props.renderPost() : null}
                </View>
            )
        }
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.props.renderLeftIcons
                    ? this.props.renderLeftIcons()
                    : null}
                <View style={{ ...this.props.textInputContainerStyle }}>
                    <TextInput
                        {...this.props}
                        autoCorrect
                        ref={(component) => (this._textInput = component)}
                        onChangeText={this.onChangeText.bind(this)}
                        onSelectionChange={this.handleOnSelectionChange.bind(
                            this
                        )}
                        multiline={true}
                        value={this.props.value}
                        style={{
                            ...this.props.textInputStyle,
                            minHeight: this.props.textInputMinHeight,
                            maxHeight: this.props.textInputMaxHeight,
                            paddingTop: 4,
                            paddingBottom: 3,
                        }}
                        placeholder={
                            this.props.placeholder
                                ? this.props.placeholder
                                : 'Write a comment...'
                        }
                    />
                </View>
                {this.props.renderPost ? this.props.renderPost() : null}
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.props.suggestionPosition &&
                this.props.suggestionPosition === 'bottom' ? null : (
                    <Animated.View
                        style={[
                            {
                                ...this.props.suggestionsPanelStyle,
                            },
                            {
                                height: this.state.suggestionRowHeight,
                                borderBottomWidth: _.isEmpty(
                                    this.props.suggestionsData
                                )
                                    ? 0
                                    : 0.5,
                                borderBottomColor: 'lightgray',
                            },
                        ]}
                    >
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            horizontal={this.props.horizontal}
                            ListEmptyComponent={this.props.loadingComponent}
                            ItemSeparatorComponent={this.renderItemSeparator}
                            enableEmptySections
                            data={this.props.suggestionsData}
                            onLoadMore={this.triggerLoadMore}
                            keyExtractor={this.props.keyExtractor}
                            renderItem={(rowData) => {
                                return this.props.renderSuggestionsRow(
                                    rowData,
                                    this.stopTracking.bind(this),
                                    this.cursorPosition
                                )
                            }}
                        />
                    </Animated.View>
                )}

                {this.props.renderSuggestionPreview
                    ? this.props.renderSuggestionPreview()
                    : null}
                {this.props.renderMedia ? this.props.renderMedia() : null}
                {this.renderTextInput()}
                {this.props.suggestionPosition &&
                this.props.suggestionPosition === 'bottom' ? (
                    <Animated.View
                        style={[
                            {
                                ...this.props.suggestionsPanelStyle,
                            },
                            {
                                height: this.state.suggestionRowHeight,
                                borderBottomWidth: _.isEmpty(
                                    this.props.suggestionsData
                                )
                                    ? 0
                                    : 0.5,
                                borderBottomColor: 'lightgray',
                            },
                        ]}
                    >
                        <FlatList
                            keyboardShouldPersistTaps={'always'}
                            horizontal={this.props.horizontal}
                            ListEmptyComponent={this.props.loadingComponent}
                            ItemSeparatorComponent={this.renderItemSeparator}
                            enableEmptySections
                            data={this.props.suggestionsData}
                            onLoadMore={this.triggerLoadMore}
                            keyExtractor={this.props.keyExtractor}
                            renderItem={(rowData) => {
                                return this.props.renderSuggestionsRow(
                                    rowData,
                                    this.stopTracking.bind(this),
                                    this.cursorPosition
                                )
                            }}
                        />
                    </Animated.View>
                ) : null}
            </View>
        )
    }
}

MentionsTextInput.propTypes = {
    textInputStyle: TextInput.propTypes.style,
    suggestionsPanelStyle: ViewPropTypes.style,
    loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    textInputMinHeight: PropTypes.number,
    textInputMaxHeight: PropTypes.number,
    trigger: PropTypes.string.isRequired,
    triggerLocation: PropTypes.oneOf(['new-word-only', 'anywhere']).isRequired,
    value: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    triggerCallback: PropTypes.func.isRequired,
    renderSuggestionsRow: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    suggestionsData: PropTypes.array.isRequired,
    keyExtractor: PropTypes.func.isRequired,
    horizontal: PropTypes.bool,
    suggestionRowHeight: PropTypes.number.isRequired,
    MaxVisibleRowCount: function (props, propName, componentName) {
        if (!props.horizontal && !props.MaxVisibleRowCount) {
            return new Error(
                `Prop 'MaxVisibleRowCount' is required if horizontal is set to false.`
            )
        }
    },
}

MentionsTextInput.defaultProps = {
    textInputStyle: { borderColor: '#ebebeb', borderWidth: 1, fontSize: 15 },
    suggestionsPanelStyle: { backgroundColor: 'rgba(100,100,100,0.1)' },
    loadingComponent: () => <Text>Loading...</Text>,
    horizontal: true,
}
