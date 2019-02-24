import React, { Component } from 'react';
import {
  View,
  KeyboardAvoidingView,
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
  formValueSelector,
  SubmissionError,
  reset
} from 'redux-form';
import R from 'ramda';
import moment from 'moment';
import {
  MenuProvider,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu';
import Slider from 'react-native-slider';
import DraggableFlatlist from 'react-native-draggable-flatlist';
import DateTimePicker from 'react-native-modal-datetime-picker';

// Components
// import DraggableFlatlist from '../Common/DraggableFlatlist';
import ModalHeader from '../../Common/Header/ModalHeader';
import Button from '../Button';
import InputField from '../../Common/TextInput/InputField';
import ViewableSettingMenu from '../ViewableSettingMenu';
import MentionsTextInput from '../Common/MentionsTextInput';
import ProfileImage from '../../Common/ProfileImage';
import EmptyResult from '../../Common/Text/EmptyResult';

// assets
import defaultUserProfile from '../../../asset/utils/defaultUserProfile.png';
import plus from '../../../asset/utils/plus.png';
import cancel from '../../../asset/utils/cancel_no_background.png';
import dropDown from '../../../asset/utils/dropDown.png';

// Actions
// import { } from '../../actions';
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

const { Popover } = renderers;
const { width } = Dimensions.get('window');

const STEP_PLACE_HOLDER = 'Add an important step to achieving your goal...';
const NEED_PLACE_HOLDER = 'Something you\'re specifically looking for help with';
const INITIAL_TAG_SEARCH = {
  data: [],
  skip: 0,
  limit: 10,
  loading: false
};
const DEBUG_KEY = '[ UI NewGoalView ]';

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
  }

  componentDidMount() {
    this.initializeForm();
  }

  componentWillUnmount() {
    console.log(`${DEBUG_KEY}: unmounting NewGoalView`);
  }

  /* Tag related functions */
  onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
    hidePanel();
    const { name } = item;
    const { details, tags } = this.props;
    if (!details || _.isEmpty(details)) return '';
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
    if (searchContent !== this.state.keyword) return '';
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
    const values = [{}];
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
    const { initializeFromState, goal } = this.props;
    const initialVals = initializeFromState
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
      // throw new SubmissionError(errors);
      return Alert.alert('Error', 'You have incomplete fields.');
    }

    const { goal, initializeFromState, uploading } = this.props;
    if (!uploading) return; // when uploading is false, it's actually uploading.
    const goalId = goal ? goal._id : undefined;

    return this.props.submitGoal(
      this.props.formVals.values,
      this.props.user._id,
      initializeFromState,
      () => {
        console.log(`${DEBUG_KEY}: poping the modal`);
        Actions.pop();
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
          imageContainerStyle={styles.imageContainerStyle}
          imageUrl={profile && profile.image ? profile.image : undefined}
          imageStyle={{ height: 31, width: 30, borderRadius: 3 }}
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
      input: { onFocus, value, onChange, ...restInput },
      editable,
      placeholder,
      numberOfLines,
      style,
      loading,
      tagData,
      change,
      meta: { touched, error },
      ...custom
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
    // return (
    //   <View style={styles.inputContainerStyle}>
    //     <TextInput
    //       placeholder={placeholder}
    //       onChangeText={(val) => onChange(val)}
    //       style={style}
    //       editable={editable}
    //       multiline={multiline}
    //       numberOfLines={numberOfLines}
    //       value={_.isEmpty(value) ? '' : value}
    //     />
    //   </View>
    // );
  }

  renderUserInfo(user) {
    if (!user) return '';
    let imageUrl = user.profile.image;
    let profileImage =
      <Image style={styles.imageStyle} resizeMode='contain' source={defaultUserProfile} />;
    if (imageUrl) {
      imageUrl = `https://s3.us-west-2.amazonaws.com/goalmogul-v1/${imageUrl}`;
      profileImage = <Image style={styles.imageStyle} source={{ uri: imageUrl }} />;
    }
    const callback = R.curry((value) => this.props.change('privacy', value));
    const shareToMastermindCallback = R.curry((value) => this.props.change('shareToMastermind', value));
    return (
      <View style={{ flexDirection: 'row', marginBottom: 15 }}>
        {profileImage}
        <View style={{ marginLeft: 15 }}>
          <Text style={{ fontSize: 18, marginBottom: 8 }}>
            {user.name}
          </Text>
          <ViewableSettingMenu
            viewableSetting={this.props.privacy}
            callback={callback}
            shareToMastermind={this.props.shareToMastermind}
            shareToMastermindCallback={shareToMastermindCallback}
          />
        </View>
      </View>
    );
  }

  renderGoal() {
    const { title } = this.props;
    const titleText = <Text style={styles.titleTextStyle}>Your Goal</Text>;
    const titleCount = <Text style={styles.titleTextStyle}>{title ? title.length : 0}/90</Text>;
    const header = (
      <View style={{ flexDirection: 'row' }}>
        {titleText}
        <View style={{ flex: 1 }} />
        {titleCount}
      </View>
    );
    return (
      <View>
        {header}
        <Field
          name='title'
          label='title'
          component={InputField}
          editable={this.props.uploading}
          style={{ ...styles.goalInputStyle, paddingTop: 20, paddingBottom: 0 }}
          placeholder='What are you trying to achieve?'
          autoCorrect
          autoCapitalize={'sentences'}
          multiline
          blurOnSubmit
          maxLength={90}
        />
      </View>
    );
  }

  renderGoalDescription = ({
    fields,
    meta: { error, submitFailed },
    loading,
    data,
    keyword
  }) => {
    // console.log(`${DEBUG_KEY}: loading: ${loading}, data: ${data}, keyword: ${keyword}`);
    const button = fields.length > 0 ?
      (<Button
        text='remove description'
        source={cancel}
        onPress={() => {
          fields.remove(0);
          this.props.change('tags', []);
        }}
      />)
      :
      <Button text='detailed description' source={plus} onPress={() => fields.push({})} />;

    const fieldsComponet = fields.length > 0 ?
      fields.map((description, index) => {
        return (
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
            placeholder="Decribe your goal"
            multiline
            loading={this.state.tagSearchData.loading}
            tagData={this.state.tagSearchData.data}
            keyword={this.state.keyword}
            change={(type, val) => this.props.change(type, val)}
          />
        );
      }) : '';
    return (
      <View style={{ marginTop: 10 }}>
        {fieldsComponet}
        {button}
      </View>
    );
  }

  renderCategory = () => {
    const titleText = <Text style={styles.titleTextStyle}>Category</Text>;

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
      // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    );

    return (
      <View
        style={{
          ...styles.sectionMargin,
          justifyContent: 'flex-start',
          flex: 1
        }}
      >
        {titleText}
        {menu}
      </View>
    );
  }

  renderPriority = () => {
    // const menu = MenuFactory(
    //   ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    //   this.handlePriorityOnSelect,
    //   this.props.priority,
    //   { ...styles.triggerContainerStyle, width: 80 },
    //   () => console.log('animationCallback')
    //   // () => this.scrollView.scrollTo({ x: 0, y: 50, animated: true })
    // );
    const valueText = (
      <Text
        style={{
          ...styles.titleTextStyle,
          fontSize: 14,
          fontWeight: '700'
        }}
      >
        {this.props.priority}
      </Text>
    );

    const titleText = (
      <Text style={styles.titleTextStyle}>
        Priority  {valueText}
      </Text>
    );

    const menu = (
      <Slider
        value={this.props.priority}
        onValueChange={value => this.handlePriorityOnSelect(value)}
        step={1}
        minimumValue={1}
        maximumValue={10}
        disabled={!this.props.uploading}
      />
    );

    return (
      <View style={{ ...styles.sectionMargin, justifyContent: 'flex-start', flex: 1 }}>
        {titleText}
        {menu}
      </View>
    );
  }

  // Renderer for timeline
  renderTimeline = () => {
    const titleText = <Text style={styles.titleTextStyle}>Timeline</Text>;
    // if (!this.props.hasTimeline) {
    //   return (
    //     <View style={{ ...styles.sectionMargin }}>
    //       {titleText}
    //       <TouchableOpacity 
    //         activeOpacity={0.85}
    //         style={{
    //           height: 40,
    //           width: 90,
    //           backgroundColor: '#fafafa',
    //           borderRadius: 4,
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           marginTop: 8,
    //           flexDirection: 'row',
    //           padding: 10
    //         }}
    //         onPress={() => this.props.change('hasTimeline', true)}
    //       >
    //         <Image source={plus} style={{ height: 11, width: 11 }} />
    //         <Text style={{ fontSize: 14, fontWeight: '600', marginLeft: 4 }}>
    //           Timeline
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   );
    // }
    if (this.props.startTime === undefined) return '';

    const newPicker = true;
    const startDatePicker = newPicker ?
      (
        <DateTimePicker
          isVisible={this.props.startTime.picker}
          onConfirm={(date) => {
            if (validateTime(date, this.props.endTime.date)) {
              this.props.change('startTime', { date, picker: false });
              return;
            }
            alert('Start time should not be later than start time');
          }}
          onCancel={() =>
            this.props.change('startTime', {
              date: this.props.startTime.date, picker: false
            })
          }
        />
      ) :
      (
        <Modal
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

        </Modal>
      );

      const endDatePicker = newPicker ?
        (
          <DateTimePicker
            isVisible={this.props.endTime.picker}
            onConfirm={(date) => {
              if (validateTime(this.props.startTime.date, date)) {
                this.props.change('endTime', { date, picker: false });
                return;
              }
              alert('End time should not be early than start time');
            }}
            onCancel={() =>
              this.props.change('endTime', {
                date: this.props.endTime.date, picker: false
              })
            }
          />
        ) :
        (
          <Modal
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

          </Modal>
        );

    const startTime = this.props.startTime.date ?
      <Text>{moment(this.props.startTime.date).format('DD/MM/YYYY')}</Text> :
      <Text style={{ fontSize: 9 }}>Start</Text>;

    const endTime = this.props.endTime.date ?
      <Text>{moment(this.props.endTime.date).format('DD/MM/YYYY')}</Text> :
      <Text style={{ fontSize: 9 }}>End</Text>;

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        <View style={{ marginTop: 8, flexDirection: 'row' }}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              height: 50,
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
              ...styles.borderStyle
            }}
            onPress={() =>
              this.props.change('startTime', {
                date: this.props.startTime.date ? this.props.startTime.date : new Date(),
                picker: true
              })
            }
          >
            {startTime}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{
              height: 50,
              width: 130,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 15,
              ...styles.borderStyle
            }}
            onPress={() =>
              this.props.change('endTime', {
                date: this.props.endTime.date ? this.props.endTime.date : new Date(),
                picker: true
              })
            }
          >
            {endTime}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={{ justifyContent: 'center', padding: 10 }}
            onPress={() => {
              this.props.change('hasTimeline', false);
              this.props.change('endTime', {
                date: undefined, picker: false
              });
              this.props.change('startTime', {
                date: undefined, picker: false
              });
            }}
          >
            <Image source={cancel} style={{ ...styles.cancelIconStyle }} />
          </TouchableOpacity>
        </View>
        {startDatePicker}
        {endDatePicker}
      </View>
    );
  }

  renderFieldArrayItem = (props, placeholder, fields, canDrag) => {
    const { item, index, move, moveEnd, isActive } = props;
    const iconOnPress = index === 0 ?
      undefined
      :
      () => fields.remove(index);
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: isActive ? 'red' : 'white' }}
      >
        <Field
          key={`description-${index}`}
          name={`${item.item}.description`}
          component={InputField}
          editable={this.props.uploading}
          numberOfLines={4}
          style={styles.standardInputStyle}
          placeholder={placeholder}
          iconSource={cancel}
          iconStyle={styles.cancelIconStyle}
          iconOnPress={iconOnPress}
          move={move}
          moveEnd={moveEnd}
          canDrag={canDrag}
          autoCorrect
          autoCapitalize={'sentences'}
          inputContainerStyle={{ flexDirection: 'row' }}
        />
      </View>
    );
  }

  renderFieldArray = (title, buttonText, placeholder, fields, error) => {
    const button = <Button text={buttonText} source={plus} onPress={() => fields.push({})} />;
    const titleText = <Text style={styles.titleTextStyle}>{title}</Text>;

    let dataToRender = [];
    fields.forEach((field, index) => {
      const dataToPush = {
        item: _.cloneDeep(field),
        index
      };
      dataToRender.push(dataToPush);
    });
    const fieldsComponent = fields.length > 0 ?
      (
        <DraggableFlatlist
          renderItem={(props) => this.renderFieldArrayItem(props, placeholder, fields, true)}
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
        />
      )
      // This is the original version to render undraggable list
      // fields.map((field, index) => {
      //   const iconOnPress = index === 0 ?
      //     undefined
      //     :
      //     () => fields.remove(index);
      //   return (
      //     <Field
      //       key={`description-${index}`}
      //       name={`${field}.description`}
      //       component={InputField}
      //       editable={this.props.uploading}
      //       numberOfLines={4}
      //       style={styles.standardInputStyle}
      //       placeholder={placeholder}
      //       iconSource={cancel}
      //       iconStyle={styles.cancelIconStyle}
      //       iconOnPress={iconOnPress}
      //     />
      //   );
      // })
      : '';

    return (
      <View style={{ ...styles.sectionMargin }}>
        {titleText}
        {fieldsComponent}
        {button}
      </View>
    );
  }

  renderSteps = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray(
      'Steps',
      'step',
      STEP_PLACE_HOLDER,
      fields,
      error
    );
  }

  renderNeeds = ({ fields, meta: { error, submitFailed } }) => {
    return this.renderFieldArray('Needs (optional)', 'need', NEED_PLACE_HOLDER, fields, error);
  }

  render() {
    const { handleSubmit, errors, user } = this.props;
    const actionText = this.props.initializeFromState ? 'Update' : 'Create';
    const titleText = this.props.initializeFromState ? 'Edit Goal' : 'New Goal';

    return (
        <KeyboardAvoidingView
          behavior='padding'
          style={{ flex: 1, backgroundColor: '#ffffff' }}
        >
        {/** 
          <ModalHeader
            title={titleText}
            actionText={actionText}
            onCancel={() => Actions.pop()}
            onAction={handleSubmit(this.handleCreate)}
          />
        */}
          <ScrollView
            style={{ borderTopColor: '#e9e9e9', borderTopWidth: 1 }}
            scrollEnabled={this.state.scrollEnabled}
          >
            <View style={{ flex: 1, padding: 20 }}>
              {this.renderUserInfo(user)}
              {this.renderGoal()}
              <FieldArray
                name="details"
                component={this.renderGoalDescription}
                loading={this.state.tagSearchData.loading}
                tagData={this.state.tagSearchData.data}
                keyword={this.state.keyword}
              />
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  {this.renderCategory()}
                </View>
                <View style={{ flex: 1 }}>
                  {this.renderPriority()}
                </View>
              </View>

              {this.renderTimeline()}
              <FieldArray name="steps" component={this.renderSteps} />
              <FieldArray name="needs" component={this.renderNeeds} />
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
    );
  }
}

const validateTime = (start, end) => {
  if (!start || !end) return true;
  if (moment(start) > moment(end)) return false;
  return true;
};

const styles = {
  activityIndicatorStyle: {
    flex: 1, height: 50, width: '100%', justifyContent: 'center', alignItems: 'center'
  },
  imageContainerStyle: {
    borderWidth: 0.5,
    padding: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: 'white',
    marginLeft: 10,
    marginRight: 10,
    margin: 5
  },
  sectionMargin: {
    marginTop: 20
  },
  inputContainerStyle: {
    flex: 1,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
  },
  imageStyle: {
    height: 54,
    width: 54,
    borderRadius: 5,
  },
  titleTextStyle: {
    fontSize: 11,
    color: '#a1a1a1',
    padding: 2
  },
  standardInputStyle: {
    flex: 1,
    fontSize: 12,
    padding: 13,
    paddingTop: 13,
    paddingRight: 6,
    paddingLeft: 6
  },
  goalInputStyle: {
    fontSize: 20,
    padding: 30,
    paddingRight: 20,
    paddingLeft: 20
  },
  cancelIconStyle: {
    height: 16,
    width: 16,
    justifyContent: 'flex-end'
  },
  caretStyle: {
    marginRight: 10,
    height: 18,
    width: 18
  },
  borderStyle: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  // Menu related style
  triggerContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#e9e9e9',
    shadowColor: '#ddd',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 1,
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
            style={{ fontSize: 15, margin: 10, marginLeft: 15, flex: 1 }}
          >
            {triggerText}
          </Text>
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