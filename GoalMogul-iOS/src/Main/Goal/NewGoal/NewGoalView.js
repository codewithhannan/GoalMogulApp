import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Image,
    Text,
    TouchableOpacity,
    Dimensions,
    FlatList,
    DatePickerIOS,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    FieldArray,
    Field,
    reduxForm,
    formValueSelector
} from 'redux-form';
import moment from 'moment';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import Slider from 'react-native-slider';
import DraggableFlatlist from 'react-native-draggable-flatlist';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { walkthroughable, CopilotStep } from 'react-native-copilot-gm';

// Components
import ModalHeader from '../../Common/Header/ModalHeader';
import Button from '../Button';
import InputField from '../../Common/TextInput/InputField';
import MentionsTextInput from '../Common/MentionsTextInput';
import ProfileImage from '../../Common/ProfileImage';
import EmptyResult from '../../Common/Text/EmptyResult';

// assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import CalenderIcon from '../../../asset/utils/calendar_empty.png';
import plus from '../../../asset/utils/plus.png';
import cancel from '../../../asset/utils/cancel_no_background.png';
import dropDown from '../../../asset/utils/dropDown.png';
import arrowRight from '../../../asset/utils/arrow_right.png';

// Actions
import {
    validate,
    submitGoal,
    goalToFormAdaptor
} from '../../../redux/modules/goal/CreateGoalActions';
import { searchUser } from '../../../redux/modules/search/SearchActions';

// Selector
import {
    getGoalDetailByTab
} from '../../../redux/modules/goal/selector';

// Utils
import { arrayUnique, clearTags } from '../../../redux/middleware/utils';
import { DEFAULT_STYLE, BACKGROUND_COLOR, GM_BLUE } from '../../../styles';
import { PRIVACY_OPTIONS, DAY_IN_MS } from '../../../Utils/Constants';


const { Popover } = renderers;
const { width } = Dimensions.get('window');

const TYPE_MAP = {
    step: {
        title: 'Steps',
        placeholder: 'Add an important step for achieving your goal',
        buttonText: 'Add a Step'
    },
    need: {
        title: 'Needs',
        placeholder: 'Something you\'re specifically looking for help with',
        buttonText: 'Add a Need'
    }
}
const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false
};
const DEBUG_KEY = '[ UI NewGoalView ]';
const WalkableView = walkthroughable(View);

class NewGoalView extends Component {
    constructor(props) {
        super(props);
        this.initializeForm();
        this.state = {
            scrollEnabled: true,
            keyword: '',
            tagSearchData: { ...INITIAL_TAG_SEARCH },
        };
        this.updateSearchRes = this.updateSearchRes.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.handleLayoutChange = this.handleLayoutChange.bind(this);
        this.scrollToEnd = this.scrollToEnd.bind(this);
    }

    componentDidMount() {
        this.initializeForm();
        if (this.props.onRef !== null) {
            this.props.onRef(this);
        }
    }

    componentWillUnmount() {
        console.log(`${DEBUG_KEY}: unmounting NewGoalView`);
        if (this.reqTimer) {
            clearTimeout(this.reqTimer);
        }
    }

    /**
     * Scroll the form to the end
     */
    scrollToEnd() {
        if (this.scrollView !== undefined) {
            this.scrollView.scrollToEnd();
        }
    }

    /**
     * y: calculated height to move based on the screen
     * type: ['step', 'need']
     * index: index in the type array starting from 0
     */
    scrollTo = (y, type, index) => {
        // console.log(`${DEBUG_KEY}: scrollTo is called to scroll to y: ${y}`);
        // console.log(`${DEBUG_KEY}: need length: `, this.props.steps.length);
        // console.log(`${DEBUG_KEY}: index is: `, index);
        let extraNumber = 0;
        if (type === 'step') {
            extraNumber = index;
        }
        if (type === 'need') {
            extraNumber = (this.props.steps.length + 2) + index;
        }

        const extraScrollToHeight = extraNumber * 75 * DEFAULT_STYLE.uiScale;
        // console.log(`${DEBUG_KEY}: extra scroll height:`, extraScrollToHeight);
        this.scrollView.scrollTo({ y: 300 / DEFAULT_STYLE.uiScale + y + extraScrollToHeight, animated: true });
    }

    handleLayoutChange = ({ nativeEvent }) => {
        console.log(`${DEBUG_KEY}: [ handleLayoutChange ]: layout: `, nativeEvent.layout);
    }

    /* Tag related functions */
    onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
        hidePanel();
        const { name } = item;
        const { details, tags } = this.props;
        if (!details || _.isEmpty(details)) return;
        const detail = details[0];

        const postCursorContent = detail.slice(cursorPosition);
        const prevCursorContent = detail.slice(0, cursorPosition);
        const content = prevCursorContent.slice(0, -this.state.keyword.length);
        const newContent = `${content}@${name} ${postCursorContent.replace(/^\s+/g, '')}`;
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        // console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
        this.props.change('details[0]', newContent);

        const newContentTag = {
            user: item,
            startIndex: content.length, // `${comment}@${name} `
            endIndex: content.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`
        };

        // Clean up tags position before comparing
        const newTags = clearTags(newContent, newContentTag, tags);

        // Check if this tags is already in the array
        const containsTag = newTags.some((t) => (
            t.tagReg === `\\B@${name}` && t.startIndex === content.length + 1
        ));

        const needReplceOldTag = newTags.some((t) => (
            t.startIndex === content.length
        ));

        // Update comment contentTags regex and contentTags
        if (!containsTag) {
            let newContentTags;
            if (needReplceOldTag) {
                newContentTags = newTags.map((t) => {
                    if (t.startIndex === newContentTag.startIndex) {
                        return newContentTag;
                    }
                    return t;
                });
            } else {
                newContentTags = [...newTags, newContentTag];
            }

            this.props.change(
                'tags',
                newContentTags.sort((a, b) => a.startIndex - b.startIndex)
            );
        }

        // Clear tag search data state
        this.setState({
            ...this.state,
            tagSearchData: { ...INITIAL_TAG_SEARCH }
        });
    }

    // This is triggered when a trigger (@) is removed. Verify if all tags
    // are still valid.
    validateContentTags = (change) => {
        const { tags, details } = this.props;
        console.log(`${DEBUG_KEY}: details are: `, details);
        if (!details || _.isEmpty(details)) return;
        const content = details[0];
        const newContentTags = tags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag;

            const actualTag = content.slice(startIndex, endIndex);
            // Verify if with the same startIndex and endIndex, we can still get the
            // tag. If not, then we remove the tag.
            return actualTag === tagText;
        });
        change('tags', newContentTags);
    }

    updateSearchRes(res, searchContent) {
        // console.log(`${DEBUG_KEY}: res is: `, res);
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        // console.log(`${DEBUG_KEY}: searchContent is: `, searchContent);
        if (searchContent !== this.state.keyword) return;
        this.setState({
            ...this.state,
            // keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                skip: res.data.length, //TODO: new skip
                data: res.data,
                loading: false
            }
        });
    }

    triggerCallback(keyword) {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer);
        }

        this.reqTimer = setTimeout(() => {
            console.log(`${DEBUG_KEY}: requesting for keyword: `, keyword);
            this.setState({
                ...this.state,
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    loading: true
                }
            });
            const { limit } = this.state.tagSearchData;
            this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
                this.updateSearchRes(res, searchContent);
            });
        }, 150);
    }

    handleTagSearchLoadMore = () => {
        const { tagSearchData, keyword } = this.state;
        const { skip, limit, data, loading } = tagSearchData;

        if (loading) return;
        this.setState({
            ...this.state,
            keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                loading: true
            }
        });

        this.props.searchUser(keyword, skip, limit, (res) => {
            this.setState({
                ...this.state,
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    skip: skip + res.data.length, //TODO: new skip
                    data: arrayUnique([...data, ...res.data]),
                    loading: false
                }
            });
        });
    }
    /* Tag related functions end */

    initializeForm() {
        const values = [{ isCompleted: false }];
        const defaulVals = {
            steps: [...values],
            needs: [...values],
            shareToMastermind: true,
            category: 'General',
            privacy: 'Friends',
            priority: 1,
            hasTimeline: false,
            startTime: { date: undefined, picker: false },
            endTime: { date: undefined, picker: false },
            title: '',
            tags: []
        };

        // Initialize based on the props, if it's opened through edit button
        const { initializeFromState, goal, isImportedGoal } = this.props;
        const initialVals = initializeFromState || isImportedGoal
            ? { ...goalToFormAdaptor(goal) }
            : { ...defaulVals };
        // console.log('initial values are: ', initialVals);
        this.props.initialize({
            ...initialVals
        });
    }

    handleCatergoryOnSelect = (value) => {
        console.log('category selected is: ', value);
        this.props.change('category', value);
    }

    handlePriorityOnSelect = (value) => {
        // console.log('priority selected is: ', value);
        this.props.change('priority', value);
    }

    // Goal creation handler
    /**
     * This is a hacky solution due to the fact that redux-form
     * handleSubmit values differ from the values actually stored.
     * NOTE:
     * Verify by comparing
     * console.log('handleSubmit passed in values are: ', values);
     * console.log('form state values: ', this.props.formVals);
     *
     * Synchronize validate form values, contains simple check
     */
    handleCreate = values => {
        const errors = validate(this.props.formVals.values);
        console.log(`${DEBUG_KEY}: raw goal values are: `, this.props.formVals.values);
        if (!(Object.keys(errors).length === 0 && errors.constructor === Object)) {
            return Alert.alert('Error', 'You have incomplete fields.');
        }

        const { goal, initializeFromState, uploading, callback } = this.props;
        if (!uploading) return; // when uploading is false, it's actually uploading.
        const goalId = goal ? goal._id : undefined;

        return this.props.submitGoal(
            this.props.formVals.values,
            this.props.user._id,
            initializeFromState,
            () => {
                console.log(`${DEBUG_KEY}: [handleCreate] poping the modal`);
                Actions.pop();
                if (callback) {
                    callback(); // Callback passed to CreateGoalModal
                }
            },
            goalId
        );
    }

    renderTagSearchLoadingComponent(loading) {
        if (loading) {
            return (
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator />
                </View>
            );
        }
        return <EmptyResult text={'No User Found'} textStyle={{ paddingTop: 15, height: 50 }} />;
    }

    /**
     * This is to render tagging suggestion row
     * @param hidePanel: lib passed in funct to close suggestion panel
     * @param item: suggestion item to render
     */
    renderSuggestionsRow({ item }, hidePanel, cursorPosition) {
        const { name, profile } = item;
        return (
            <TouchableOpacity
                onPress={() => this.onTaggingSuggestionTap(item, hidePanel, cursorPosition)}
                style={{
                    height: 50,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white'
                }}
            >
                <ProfileImage
                    defaultImageContainerStyle={styles.imageContainerStyle}
                    imageContainerStyle={{ ...styles.imageContainerStyle, borderWidth: 0 }}
                    imageUrl={profile && profile.image ? profile.image : undefined}
                    imageStyle={{ height: 30, width: 30, borderRadius: 15 }}
                    defaultImageSource={defaultUserProfile}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        );
    }

    /**
     * This is added on ms2 polish as a new way to render textinput
     */
    renderInput = (props) => {
        const {
            input: { value, onChange },
            editable,
            placeholder,
            style,
            loading,
            tagData,
            change
        } = props;

        const { tags } = this.props;

        return (
            <View style={{ zIndex: 3 }}>
                <MentionsTextInput
                    placeholder={placeholder}
                    onChangeText={(val) => onChange(val)}
                    editable={editable}
                    value={_.isEmpty(value) ? '' : value}
                    contentTags={tags || []}
                    contentTagsReg={tags ? tags.map((t) => t.tagReg) : []}
                    tagSearchRes={this.state.tagSearchData.data}
                    flexGrowDirection='bottom'
                    suggestionPosition='bottom'
                    textInputContainerStyle={{ ...styles.inputContainerStyle }}
                    textInputStyle={style}
                    validateTags={() => this.validateContentTags(change)}
                    autoCorrect
                    suggestionsPanelStyle={{ backgroundColor: '#f8f8f8' }}
                    loadingComponent={() => this.renderTagSearchLoadingComponent(loading)}
                    textInputMinHeight={80}
                    textInputMaxHeight={200}
                    trigger={'@'}
                    triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                    triggerCallback={(keyword) => this.triggerCallback(keyword)}
                    triggerLoadMore={this.handleTagSearchLoadMore.bind(this)}
                    renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
                    suggestionsData={tagData} // array of objects
                    keyExtractor={(item, index) => item._id}
                    suggestionRowHeight={50}
                    horizontal={false} // defaut is true, change the orientation of the list
                    MaxVisibleRowCount={4} // this is required if horizontal={false}
                />
            </View>
        );
    }

    /**
     * 
     * @param {object} user 
     * @param {boolean} isEdit: initializeFromState to determine if this is editing a goal
     */
    renderPrivacyControl(isEdit) {
        return (
            <View style={styles.sectionMargin}>
                <Menu rendererProps={{ placement: 'top', anchorStyle: styles.anchorStyle }}
                    renderer={renderers.Popover}
                >
                    <Text style={styles.subTitleTextStyle}>Privacy</Text>
                    <MenuTrigger customStyles={{ TriggerTouchableComponent: TouchableOpacity }}>
                        <View style={{
                            width: '100%',
                            borderWidth: 1,
                            borderColor: '#E0E0E0',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 5
                        }}>
                            <Text style={styles.standardInputStyle}>
                                {PRIVACY_OPTIONS.map(({ text, value }) => {
                                    if (this.props.privacy === value) return text;
                                })}
                            </Text>
                            <Image resizeMode="contain" style={styles.caretStyle} source={dropDown} />
                        </View>
                    </MenuTrigger>
                    <MenuOptions customStyles={styles.menuOptionsStyles}>
                        {PRIVACY_OPTIONS.map(({ value, text }) => {
                            return <MenuOption onSelect={() => { this.props.change('privacy', value) }}>
                                <View style={{
                                    width: '100%'
                                }}>
                                    <Text style={styles.standardInputStyle}>{text}</Text>
                                </View>
                            </MenuOption>
                        })}
                    </MenuOptions>
                </Menu>
            </View>
        );
    }

    renderGoal() {
        const { title } = this.props;
        return (
            <CopilotStep text={this.props.tutorialText[1]} order={1} name="create_goal_create_goal_modal_1">
                <WalkableView>
                    <FieldTitleText text='What are you trying to achieve?' required={true} style={{ marginBottom: 16 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.subTitleTextStyle}>Your Goal</Text>
                        <Text style={DEFAULT_STYLE.smallText_2}>{title ? title.length : 0}/90</Text>
                    </View>
                    <Field
                        name='title'
                        label='title'
                        component={InputField}
                        editable={this.props.uploading}
                        style={{ ...styles.standardInputStyle }}
                        placeholder='What are you trying to achieve?'
                        autoCorrect
                        autoCapitalize={'sentences'}
                        multiline
                        blurOnSubmit
                        maxLength={90}
                    />
                </WalkableView>
            </CopilotStep>
        );
    }

    renderGoalDescription = ({ fields }) => {
        const { details } = this.props;
        if (fields.length === 0) fields.push({});

        return fields.map((description, index) => {
            return (
                <WalkableView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <Text style={styles.subTitleTextStyle}>
                            Description <Text style={DEFAULT_STYLE.smallText_1}>(Optional)</Text>
                        </Text>
                        <Text style={DEFAULT_STYLE.smallText_2}>
                            {details && details[0] && details[0].length > 0 ? this.props.details[0].length : 0}/250
                        </Text>
                    </View>
                    <Field
                        key={`goal-description-${index}`}
                        name={description}
                        component={this.renderInput}
                        editable={this.props.uploading}
                        style={{
                            ...styles.standardInputStyle,
                            paddingLeft: 15,
                            paddingRight: 15,
                            // Should approximately match numberOfLines * fontSize height + padding
                            maxHeight: 100,
                            minHeight: 80
                        }}
                        numberOfLines={5}
                        placeholder="Describe your goal"
                        multiline
                        loading={this.state.tagSearchData.loading}
                        tagData={this.state.tagSearchData.data}
                        keyword={this.state.keyword}
                        change={(type, val) => this.props.change(type, val)}
                    />
                </WalkableView>
            );
        });
    }

    renderCategory = () => {
        const menu = MenuFactory(
            [
                'General',
                'Learning/Education',
                'Career/Business',
                'Financial',
                'Spiritual',
                'Family/Personal',
                'Physical',
                'Charity/Philanthropy',
                'Travel',
                'Things'
            ],
            this.handleCatergoryOnSelect,
            this.props.category,
            { ...styles.triggerContainerStyle },
            () => console.log('animationCallback')
        );

        return (
            <CopilotStep text={this.props.tutorialText[2]} order={2} name="create_goal_create_goal_modal_2">
                <WalkableView
                    style={{
                        marginTop: 16,
                        justifyContent: 'flex-start',
                        flex: 1
                    }}
                >
                    <Text style={styles.subTitleTextStyle}>Category</Text>
                    {menu}
                </WalkableView>
            </CopilotStep>
        );
    }

    renderPriority = () => {
        const THUMB_COLORS = ['#219653', '#F07E1A', '#D71919'];
        const TRACK_COLORS = ['#27AE60', '#F2994A', '#EB5757'];
        const SLIDER_NUMS = [0, 5, 10];
        let colorIndex = 0;
        if (this.props.priority <= 3) colorIndex = 0;
        else if (this.props.priority <= 6) colorIndex = 1;
        else colorIndex = 2;

        const slider = (
            <Slider
                value={this.props.priority}
                onValueChange={value => this.handlePriorityOnSelect(value)}
                step={1}
                minimumValue={0}
                maximumValue={10}
                disabled={!this.props.uploading}
                trackStyle={{ height: 10, backgroundColor: '#F2F2F2' }}
                minimumTrackTintColor={TRACK_COLORS[colorIndex]}
                thumbStyle={{ width: 12, height: 20, backgroundColor: THUMB_COLORS[colorIndex] }}
            />
        );

        return (
            <CopilotStep text={this.props.tutorialText[3]} order={3} name="create_goal_create_goal_modal_3">
                <WalkableView style={{ ...styles.sectionMargin, justifyContent: 'flex-start', flex: 1 }}>
                    <FieldTitleText text='How important is your goal?' required={true} style={{ marginBottom: 12 }} />
                    <Text style={styles.descriptionTextStyle}>Use is to set reletive priority of your Goal.</Text>
                    {slider}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {SLIDER_NUMS.map((val) => {
                            return <Text style={DEFAULT_STYLE.normalText_1}>{val}</Text>;
                        })}
                    </View>
                </WalkableView>
            </CopilotStep>
        );
    }

    // Renderer for timeline
    renderTimeline = () => {
        if (this.props.startTime === undefined) return;

        const newPicker = true;
        const startDatePicker = newPicker ?
            (<DateTimePicker
                isVisible={this.props.startTime.picker}
                date={new Date()}
                onConfirm={(date) => {
                    if (validateTime(date, this.props.endTime.date)) {
                        this.props.change('startTime', { date, picker: false });
                        return;
                    }
                    alert('Start time cannot be later than end time');
                }}
                onCancel={() =>
                    this.props.change('startTime', {
                        date: this.props.startTime.date, picker: false
                    })
                }
            />) : (<Modal
                animationType="fade"
                transparent={false}
                visible={this.props.startTime.picker}
            >
                <ModalHeader
                    title='Select start time'
                    actionText='Done'
                    onAction={() =>
                        this.props.change('startTime', {
                            date: this.props.startTime.date,
                            picker: false
                        })
                    }
                    onCancel={() =>
                        this.props.change('startTime', {
                            date: this.props.startTime.date,
                            picker: false
                        })
                    }
                />
                <View style={{ flex: 1 }}>
                    <DatePickerIOS
                        date={this.props.startTime.date}
                        onDateChange={(date) => this.props.change('startTime', { date, picker: true })}
                        mode='date'
                    />
                </View>

            </Modal>);

        const endDatePicker = newPicker ?
            (<DateTimePicker
                isVisible={this.props.endTime.picker}
                onConfirm={(date) => {
                    if (validateTime(this.props.startTime.date, date)) {
                        this.props.change('endTime', { date, picker: false });
                        return;
                    }
                    alert('End time cannot be early than start time');
                }}
                onCancel={() =>
                    this.props.change('endTime', {
                        date: this.props.endTime.date, picker: false
                    })
                }
            />) :
            (<Modal
                animationType="fade"
                transparent={false}
                visible={this.props.endTime.picker}
            >
                <ModalHeader
                    title='Select end time'
                    actionText='Done'
                    onAction={() =>
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false
                        })
                    }
                    onCancel={() =>
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false
                        })
                    }
                />
                <View style={{ flex: 1 }}>
                    <DatePickerIOS
                        date={this.props.endTime.date}
                        onDateChange={(date) => this.props.change('endTime', { date, picker: true })}
                        mode='date'
                    />
                </View>

            </Modal>);

        if (!this.props.startTime || !this.props.startTime.date) this.props.change('startTime', { date: new Date(), picker: false })
        if (!this.props.endTime || !this.props.endTime.date) {
            this.props.change('endTime', {
                date: new Date((this.props.startTime.date ? this.props.startTime.date.getTime() : new Date().getTime()) + DAY_IN_MS), picker: false
            })
        }


        const startTime = (
            <Text style={{ ...DEFAULT_STYLE.subTitleText_1, marginLeft: 12, marginRight: 12 }}>
                {moment(this.props.startTime.date).format('ll')}
            </Text>
        );
        const endTime = (
            <Text style={{ ...DEFAULT_STYLE.subTitleText_1, marginLeft: 12, marginRight: 12 }}>
                {moment(this.props.endTime.date).format('ll')}
            </Text>
        );

        const icon = (
            <View style={{
                height: 40 * DEFAULT_STYLE.uiScale,
                width: 34 * DEFAULT_STYLE.uiScale,
                borderWidth: 1,
                borderColor: '#DFE0E1',
                backgroundColor: '#F5F7FA',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Image resizeMode="contain" source={CalenderIcon} style={{ ...DEFAULT_STYLE.buttonIcon_1, tintColor: '#DADADA' }} />
            </View>
        );

        return (
            <CopilotStep text={this.props.tutorialText[4]} order={4} name="create_goal_create_goal_modal_4">
                <WalkableView style={{ ...styles.sectionMargin }}>
                    <FieldTitleText text='Timeline' required={true} style={{ marginBottom: 12 }} />
                    <Text style={styles.descriptionTextStyle}>Give your best estimate.</Text>
                    <View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                height: 40 * DEFAULT_STYLE.uiScale,
                                flexDirection: 'row',
                                alignItems: 'center',
                                ...styles.borderStyle
                            }}
                            onPress={() =>
                                this.props.change('startTime', {
                                    date: this.props.startTime.date,
                                    picker: true
                                })
                            }
                        >
                            {icon}
                            {startTime}
                        </TouchableOpacity>
                        <Image style={{ margin: 8, ...DEFAULT_STYLE.normalIcon_1 }} source={arrowRight} />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                height: 40 * DEFAULT_STYLE.uiScale,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                ...styles.borderStyle
                            }}
                            onPress={() =>
                                this.props.change('endTime', {
                                    date: this.props.endTime.date,
                                    picker: true
                                })
                            }
                        >
                            {icon}
                            {endTime}
                        </TouchableOpacity>
                    </View>
                    {startDatePicker}
                    {endDatePicker}
                </WalkableView>
            </CopilotStep>
        );
    }

    /**
     * type: ['step', 'need']
     */
    renderFieldArrayItem = (props, placeholder, fields, canDrag, type, onSubmitEditing) => {
        const { item, index, move, moveEnd, isActive } = props;
        console.log(fields);
        const iconOnPress = () => {
                if (type !== 'step' || fields.length > 1)
                    fields.remove(index);
            };
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                backgroundColor: isActive ? 'red' : 'white'
            }}>
                <Field
                    key={`description-${index}`}
                    name={`${item.item}.description`}
                    component={InputField}
                    editable={this.props.uploading}
                    numberOfLines={4}
                    style={{ ...styles.standardInputStyle }}
                    placeholder={placeholder}
                    iconSource={cancel}
                    iconStyle={DEFAULT_STYLE.normalIcon_1}
                    iconOnPress={iconOnPress}
                    move={move}
                    blurOnSubmit
                    moveEnd={moveEnd}
                    canDrag={canDrag}
                    autoCorrect
                    autoCapitalize={'sentences'}
                    inputContainerStyle={{ flexDirection: 'row', alignItems: 'center' }}
                    scrollTo={this.scrollTo}
                    index={index}
                    type={type}
                    multiline
                    onSubmitEditing={onSubmitEditing}
                />
            </View>
        );
    }

    renderFieldArray = (type, required, fields, error) => {
        const onSubmitEditing = ({ nativeEvent }) => {
            const { text } = nativeEvent;
            if (text && text.trim() !== '') {
                fields.push({ isCompleted: false });
            }
        };

        let dataToRender = [];
        fields.forEach((field, index) => {
            const dataToPush = {
                item: _.cloneDeep(field),
                index
            };
            dataToRender.push(dataToPush);
        });

        return (
            <View style={styles.sectionMargin}>
                <FieldTitleText text={TYPE_MAP[type].title} required={required} style={{ marginBottom: 12 }} />
                {
                    fields.length > 0 ?
                        <DraggableFlatlist
                            renderItem={(props) => this.renderFieldArrayItem(props, TYPE_MAP[type].placeholder, fields, true, type, onSubmitEditing)}
                            data={dataToRender}
                            keyExtractor={item => `${item.index}`}
                            scrollPercent={5}
                            onMoveEnd={e => {
                                // console.log('moving end for e: ', e);
                                fields.move(e.from, e.to);
                                this.setState({
                                    ...this.state,
                                    scrollEnabled: true
                                });
                            }}
                            onMoveBegin={(index) => {
                                // console.log('index is being moved: ', index);
                                this.setState({
                                    ...this.state,
                                    scrollEnabled: false
                                });
                            }}
                        /> : null
                }
                <Button
                    text={TYPE_MAP[type].buttonText}
                    source={plus}
                    onPress={() => fields.push({})}
                    containerStyle={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: BACKGROUND_COLOR,
                        borderWidth: 1,
                        borderRadius: 3,
                        borderColor: GM_BLUE,
                        padding: 10
                    }}
                    iconStyle={{ ...DEFAULT_STYLE.smallIcon_1, backgroundColor: BACKGROUND_COLOR, tintColor: GM_BLUE }}
                    textStyle={{ ...DEFAULT_STYLE.titleText_1, color: GM_BLUE, marginLeft: 15 }}
                />
            </View>
        );
    }

    renderSteps = ({ fields, meta: { error, submitFailed } }) => {
        return (
            <CopilotStep text={this.props.tutorialText[5]} order={5} name="create_goal_create_goal_modal_5">
                <WalkableView>
                    {
                        this.renderFieldArray(
                            'step',
                            true,
                            fields,
                            error
                        )
                    }
                </WalkableView>
            </CopilotStep>
        );
    }

    renderNeeds = ({ fields, meta: { error, submitFailed } }) => {
        return this.renderFieldArray('need', false, fields, error);
    }

    render() {
        const { user, initializeFromState } = this.props;

        return (
            <ScrollView
                scrollEnabled={this.state.scrollEnabled}
                ref={r => { this.scrollView = r; }}
            >
                <View style={{
                    padding: 24
                }}>
                    <Text style={DEFAULT_STYLE.subTitleText_1}>Need some help forming your Goal?</Text>
                    <Button
                        text="View Trending Goals"
                        containerStyle={{
                            backgroundColor: GM_BLUE,
                            alignSelf: 'flex-start',
                            paddingLeft: 16,
                            paddingRight: 16,
                            marginTop: 16
                        }}
                        textStyle={{
                            ...DEFAULT_STYLE.titleText_1,
                            color: 'white'
                        }}
                        onPress={() => Actions.push('trendingGoalView')}
                    />
                </View>
                <View style={[DEFAULT_STYLE.shadow, { height: 8 * DEFAULT_STYLE.uiScale }]} />
                <View style={{ padding: 20, paddingBottom: 0 }}>
                    {this.renderGoal()}
                    <FieldArray
                        name="details"
                        component={this.renderGoalDescription}
                        loading={this.state.tagSearchData.loading}
                        tagData={this.state.tagSearchData.data}
                        keyword={this.state.keyword}
                    />
                    {this.renderCategory()}
                    {this.renderPriority()}
                    {this.renderTimeline()}
                </View>
                <View style={[DEFAULT_STYLE.shadow, styles.sectionMargin]} />
                <View style={{ padding: 20, paddingTop: 0, marginBottom: 30 }}>
                    <FieldArray name="steps" component={this.renderSteps} />
                    <FieldArray
                        name="needs"
                        component={this.renderNeeds}
                    />
                    {this.renderPrivacyControl(initializeFromState)}
                </View>
            </ScrollView>
        );
    }
}

const FieldTitleText = (props) => {
    const { text, style, required } = props;
    return (
        <View style={{ flexDirection: 'row', ...style }}>
            {required && <Text style={{ ...styles.subTitleTextStyle, color: 'red', paddingRight: 0 }}>
                *
            </Text>}
            <Text style={styles.titleTextStyle}>
                {text}
            </Text>
        </View>
    );
}

const validateTime = (start, end) => {
    if (!start || !end) return true;
    if (moment(start) > moment(end)) return false;
    return true;
};

const styles = {
    activityIndicatorStyle: {
        flex: 1,
        height: 50 * DEFAULT_STYLE.uiScale,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userImageContainerStyle: {
        borderWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'flex-start',
        backgroundColor: 'white'
    },
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1,
        borderColor: 'lightgray',
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'center',
        backgroundColor: 'white',
        margin: 5
    },
    sectionMargin: {
        marginTop: 40
    },
    inputContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E0E0E0'
    },
    titleTextStyle: {
        ...DEFAULT_STYLE.titleText_1,
        padding: 2
    },
    subTitleTextStyle: {
        ...DEFAULT_STYLE.titleText_2,
        padding: 2
    },
    descriptionTextStyle: {
        ...DEFAULT_STYLE.normalText_1,
        padding: 2
    },
    standardInputStyle: {
        flex: 1,
        ...DEFAULT_STYLE.subTitleText_1,
        padding: 12,
        paddingTop: 12,
        paddingRight: 12,
        paddingLeft: 12
    },
    caretStyle: {
        ...DEFAULT_STYLE.smallIcon_1,
        marginRight: 12,
        tintColor: '#333'
    },
    borderStyle: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0'
    },
    // Menu related style
    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#E0E0E0'
    },
    anchorStyle: {
        backgroundColor: 'white'
    },
    menuOptionsStyles: {
        optionsContainer: {
            width: width - 40,
            padding: 5
        },
        optionWrapper: {
            flex: 1,
        },
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            ...DEFAULT_STYLE.subTitleText_1,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10
        },
    }
};

NewGoalView = reduxForm({
    form: 'createGoalModal',
    enableReinitialize: true
})(NewGoalView);

const mapStateToProps = state => {
    const selector = formValueSelector('createGoalModal');
    const { user } = state.user;
    const { profile } = user;
    const { uploading } = state.createGoal;

    return {
        user,
        profile,
        category: selector(state, 'category'),
        privacy: selector(state, 'privacy'),
        priority: selector(state, 'priority'),
        shareToMastermind: selector(state, 'shareToMastermind'),
        hasTimeline: selector(state, 'hasTimeline'),
        startTime: selector(state, 'startTime'),
        endTime: selector(state, 'endTime'),
        needs: selector(state, 'needs'),
        steps: selector(state, 'steps'),
        tags: selector(state, 'tags'),
        details: selector(state, 'details'),
        title: selector(state, 'title'),
        formVals: state.form.createGoalModal,
        goalDetail: getGoalDetailByTab(state),
        uploading
    };
};

export default connect(
    mapStateToProps,
    {
        submitGoal,
        searchUser
    }
)(NewGoalView);

const MenuFactory = (options, callback, triggerText, triggerContainerStyle, animationCallback) => {
    return (
        <Menu
            onSelect={value => callback(value)}
            rendererProps={{ placement: 'bottom', anchorStyle: styles.anchorStyle }}
            renderer={Popover}
            onOpen={animationCallback}
        >
            <MenuTrigger
                customStyles={{
                    TriggerTouchableComponent: TouchableOpacity,
                }}
            >
                <View style={triggerContainerStyle}>
                    <Text
                        style={{ ...DEFAULT_STYLE.subTitleText_1, margin: 10, flex: 1 }}
                    >
                        {triggerText}
                    </Text>
                    <Image resizeMode="contain" style={styles.caretStyle} source={dropDown} />
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
