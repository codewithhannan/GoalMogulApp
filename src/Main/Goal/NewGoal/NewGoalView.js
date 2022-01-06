/** @format */

import _ from 'lodash'
import moment from 'moment'
import React, { Component } from 'react'
import {
    ActivityIndicator,
    Alert,
    DatePickerIOS,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { CopilotStep, walkthroughable } from 'react-native-copilot-gm'
import DraggableFlatlist from 'react-native-draggable-flatlist'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
    renderers,
} from 'react-native-popup-menu'

import { scrollInterpolator, animatedStyles } from './goalAnimation'
import { Actions } from 'react-native-router-flux'
import Slider from 'react-native-slider'
import { connect } from 'react-redux'
import { Field, FieldArray, formValueSelector, reduxForm } from 'redux-form'
import arrowRight from '../../../asset/utils/arrow_right.png'
import cancel from '../../../asset/utils/cancel_no_background.png'
import dropDown from '../../../asset/utils/dropDown.png'
import plus from '../../../asset/utils/plus.png'

// Actions
import {
    goalToFormAdaptor,
    submitGoal,
} from '../../../redux/modules/goal/CreateGoalActions'
import { searchUser } from '../../../redux/modules/search/SearchActions'
// Selector
import { getGoalDetailByTab } from '../../../redux/modules/goal/selector'

// Utils
import {
    arrayUnique,
    clearTags,
    getProfileImageOrDefaultFromUser,
} from '../../../redux/middleware/utils'
import { default_style, color } from '../../../styles/basic'
import { PRIVACY_OPTIONS, PRIVACY_FRIENDS } from '../../../Utils/Constants'
// Components
import InputBox from '../../../Main/Onboarding/Common/InputBox'
import ModalHeader from '../../Common/Header/ModalHeader'
import ProfileImage from '../../Common/ProfileImage'
import EmptyResult from '../../Common/Text/EmptyResult'
import InputField from '../../Common/TextInput/InputField'
import CreateGoalToast from './TestGoal'

import Button from '../Button'
import MentionsTextInput from '../Common/MentionsTextInput'
import { Icon } from '@ui-kitten/components'
import {
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'

const { Popover } = renderers
const { width } = Dimensions.get('window')

const TYPE_MAP = {
    step: {
        title: 'Steps',
        segmentsValue: 'steps',
        placeholder: `What's the 1st thing you should do?`,
        buttonText: 'Add Steps',
        text: 'Break your goals into steps that are easier to achieve',
    },
    need: {
        title: 'Needs',
        segmentsValue: 'needs',
        placeholder:
            'List the things that others might be able to help you with',
        buttonText: 'Add Needs',
        text: 'Something you are specifically looking for help with',
    },
}
const INITIAL_TAG_SEARCH = {
    data: [],
    skip: 0,
    limit: 10,
    loading: false,
}

const SLIDER_WIDTH = Dimensions.get('window').width
const height = Dimensions.get('window').height
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)
const ITEM_HEIGHT = Math.round((ITEM_WIDTH * 3) / 9)

const DEBUG_KEY = '[ UI NewGoalView ]'
const WalkableView = walkthroughable(View)

const DATA = []
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class NewGoalView extends Component {
    constructor(props) {
        super(props)
        this.initializeForm()
        this.state = {
            sliderNumbers: [
                { id: 1, letter: '1', value: 1, active: false },
                { id: 2, letter: '2', value: 2, active: false },
                { id: 3, letter: '3', value: 3, active: false },
                { id: 4, letter: '4', value: 4, active: false },
                { id: 5, letter: '5', value: 6, active: false },
                { id: 6, letter: '6', value: 6, active: true },
                { id: 7, letter: '7', value: 7, active: false },
                { id: 8, letter: '8', value: 8, active: false },
                { id: 9, letter: '9', value: 9, active: false },
                { id: 10, letter: '10', value: 10, active: false },
            ],

            index: 0,

            detailsFieldShow: false,

            activeIndex: 0,

            currIndex: 0,

            RANDOM_TEXT: [
                'What’s a goal that your friends would find interesting to discover about you?',

                'What future achievement would you throw a party to celebrate?',

                'What life experience would make you feel truly alive?',

                "What's a goal that would be easier to achieve with your friends' support or encouragement?",
                'With more time and energy, what fun activity would you want to do with friends?',
                'What future career accomplishment would you want to be respected for?',

                'What good deed would you like people to remember you for?',
                'What would you do differently if you won a $1,000,000 tax-free?',
                'What have you always wanted to do but have been afraid to attempt?',
                'If money and time were not an issue, how would you want to spend your time contributing to society?',
                'If you were GUARANTEED to succeed, what’s the one great thing you would dare to accomplish?',
                'What goal can you achieve together with your friends?',
                "What's an interesting class or course you could enjoy taking with friends?",
                'What relaxing activity could you start to plan so that you can see your friends more often?',
                'What future travel experience would you be excited to have with your friends?',
                "What is something you've always wanted to do, but your family or friends don't believe you could or should?",
                'If you had a few extra hours every week, how would you want to spend the additional time with your family or friends?',
                'What do you want to do with your life?',
                'What past experience brought you happiness that you would like to have again?',
                'What skillset could you develop to be irreplaceable at work?',
                'What do you regret not doing last year that you still want to do?',
                'What future accomplishment would you be proud to tell your children or grandchildren?',
                'What do you need to pursue to feel like you are living your HIGHEST PURPOSE?',

                'What activity could you start today that can bring more joy to your everyday life?',
                'What interesting goal can greatly expand your horizons?',
            ],

            RANDOM_TEXT_SILVER_BADGE: [
                'What’s a goal that your friends would find interesting to discover about you?',

                'What future achievement would you throw a party to celebrate?',

                'What life experience would make you feel truly alive?',

                "What's a goal that would be easier to achieve with your friends' support or encouragement",
                'With more time and energy, what fun activity would you want to do with friends?',
                'What future career accomplishment would you want to be respected for?',

                'What good deed would you like people to remember you for?',
                'What would you do differently if you won a $1,000,000 tax-free?',
                'What have you always wanted to do but have been afraid to attempt?',
                'If money and time were not an issue, how would you want to spend your time contributing to society?',
                'If you were GUARANTEED to succeed, what’s the one great thing you would dare to accomplish?',
                'What goal can you achieve together with your friends?',
                "What's an interesting class or course you could enjoy taking with friends?",
                'What relaxing activity could you start to plan so that you can see your friends more often?',
                'What future travel experience would you be excited to have with your friends?',
                "What is something you've always wanted to do, but your family or friends don't believe you could or should?",
                'If you had a few extra hours every week, how would you want to spend the additional time with your family or friends?',
                'What do you want to do with your life?',
                'What past experience brought you happiness that you would like to have again?',
                'What skillset could you develop to be irreplaceable at work?',
                'What do you regret not doing last year that you still want to do?',
                'What future accomplishment would you be proud to tell your children or grandchildren?',
                'What do you need to pursue to feel like you are living your HIGHEST PURPOSE?',

                'What activity could you start today that can bring more joy to your everyday life?',
                'What interesting goal can greatly expand your horizons?',
                'What product or service would you be excited to buy or treat yourself to after accomplishing one of your biggest goals?',
                "What habit would you want to start when you're able to?",
                'What health habit would you like to develop this week?	',
                'If there were no obstacles, what habit or activity could you start with to make the world a better place?',
                'What goal would you pursue if you had 100% self-confidence?',
                'What is that crucial thing you can do that would better your family life?',
                "What hobby can make you genuinely express yourself that you haven't begun?",
                'What is your vision for yourself at the peak of your career or business?',
                'If you only had one year to live, who would you want to spend the time with?',
                'What could you do to increase your chances of meeting the right person (or people) in your life [or career]?',
                'What changes could you make to boost your energy levels?',
                'What business have you always dreamed of starting but keep putting off?',
                'What voluntary action can bring life into your relationship today?',
                'You can only make one of your dreams come true, which one would you pick?',
                'When chanced, what new opportunities do you want try?',
                'What achievement would you excitedly share with a best friend?',
                'What opportunity would you value more if you had the chance to do it again?',
                'What is the goal you need to achieve to feel successful in your career?',
                'What newly learned skill or habit do you want to incorporate more into your workplace?',
                'If pursued, what goal can you accomplish for sure?',
                'What routine can you start to improve your health?',
                'What sanity have you lost and want to regain?',
                'What activity do you find relaxation in?',
                'What key action have you procastinated on that could otherwise achieve your goal?',
                'What city do you yearn to visit again?',
                "What is an activity you've left that you want to take up again?",
                'What change in your attitude can improve your friendships?',
                'What do you want to continue enjoying with your family?',
                'What habit could improve your health and physical appearance?',
                'What do you want to get better at?',
                'If given the opportunity, how would you like to treat yourself?',
                'What is a short-term goal that, if achieved, can make you happier?',
                'What goal could you achieve to increase your rewards at work?',
                'What can you do to overcome self-doubt?',
                'What is your biggest career goal?',
                'What accomplishment would make you most proud of yourself?',
                'What acivity brings you the most peace of mind?',
                "What's something you can begin to learn that would greatly improve the quality of your life?",
                'Which bad habit of yours is the biggest obstacle to achieving your goals?',
                'What do you need to reach the next level in your career?',
                'What behavior could improve your relationship with your family?',
                'To increase you business success, what can you do to better your professional networking?',
                'What key decision can you make for your professional life?',
                'What knowledge can you share to help others become better people?',
                'What habit or routine can make you focus on your goals more?',
                'If you had more time, what language(s) would you want  to learn or improve?',
                'What can you do to bring more peace in your family life?',
                'What could you create with your own hands?',
                'Magically, if you could become an expert at one thing, what would that be?',
                'What can you do to accomplish more in your career?',
                'What is the next class or course you want to take?',
                'What is a philanthropic cause you want to contribute to?',
                'What financial decision would improve your future?',
                'What positive influence do you want to have on another person?',
                'What could you do to stay more organized and focused on your goals?',
                'If achieved, what goal would make the greatest difference in your life?',
                'What goal can motivate you to get up an hour earlier every day?',
                'If you had more money and time, to what cause or organization would you contribute, and how?',
                'What is a goal you wanted to pursue, but your friends or family talked you out of it?',
                'What habit could make you a high achiever?',
                'What skill could make you more valuable in the job market?',
                'What accomplishment can change your financial situation for good?',
                "What's a work-related thing you want to accomplish next year?",
                'Where would you go; what would you do; what would you buy?',
                'What unique goal MUST you achieve THIS QUARTER to have a feeling of great contribution at work?',
                'What product or service would you buy to treat yourself as you deserve?',
                'Which new activity, if started, could help you feel more fulfilled?',
                'What activity would you like to do more often?',
                'How much money do you want to earn, to afford the activities you want?',
                'With no worry about money, what full-time activity would you engage in?',
                'What important goal do you want to accomplish in 3-5 years?',
                'You had as much money and time off from work as you wanted, where would you go, and who would you go with?',
                'What important goal do you want to accomplish in one year?',
                'What exciting experience would you like to have in life?',
                'What skill do you need to develop to land your dream job?',
                'If you had more time and resources, what musical instrument would you learn to play?',
                'What future travel experience would you excitedly tell your friends?',
                "What's an exotic place you want to visit?",
                'What future trekking activity could you plan with your friends?',
                'On what activity could you spend more time to improve the quality of your spiritual life?',
                'What is your mission in life?',
                'What is a goal you keep putting off?',
                "What's an outdoor activity you haven't been able to do?",
                'What personal goal is missing in your life?',
                "What is an area of knowledge you've always wanted to know more about?",
                'What is the most important thing you can do to improve your health?',
                "Which of your friends' goals do you admire and would like to achieve?",
                'What troubling project do you need motivation to get done?',
                'If it will certainly come true, what future achievement can bring you excitement and joy?',
                'If you were 100% confident, what would become possible for you?',

                'What can your friends help you with to increase the possibility of achieving your goal?',

                'What activity can you learn from a family member or friend this year?',
                'What do you need to get better at to improve the quality of your relationship with others?',
                'What can help you grow if you learn more about it?',
                'What desired result would you want to be remembered for?',
                'How do you intend to get enough rest this week?',
                'With time and money, what music concert could you enjoy with your friends?',
                'What could you get better at to improve the quality of your creativity and productivity?',
                'What obstacle do you need to remove to achieve your most important goal?',
                'What amusement park would you go with your friends?',
                'What kind of people would you like to work with?',
                'What new activity could help you make new friends in the next 4 weeks?',
                'What restaurant do you want to visit with your partner?',
                'What alternative career have you considered in the past that you may want to try again?',
                'If you could solve any, what problem of the world would you solve?',
                'What challenging task do you currently have at hand that you must accomplish?',
                'What habit would improve your productivity to achieve your goals?',
                'What are you willing to sacrifice to obtain the goal you want?',
                'What do you have to do less often to improve your efficiency in life?',
                'What can you start today to expand your professional network?',
                'What products or services would you buy to treat yourself as you deserve?',
                'What products or services could you sell or offer online to earn more income?',
                'What do you have to do more often to improve the quality of your life?',
                'How would you like to contribute to your family this week?',
                'What are the things that can keep you mindful of your goals?',
                'What short-term actions can help you achieve your long-term goal?',
                'What can you get better at to improve the quality of your professional life?',
                'What goal can help you achieve the kind of life you desire?',
                'With more resources and time, what part of your home would you improve or make more beautiful?	',
                'If mastered, what habit could majorly improve the quality of your life?',
                'What travel plan have you been pending the longest that you want to attain?',
                'Which accomplishment would drastically change your life for the better?',
                'If you had to enroll in an evening class this year, what would you choose to learn?',
                "What important conversations do wish to have with people you care about but haven't seen?	",
                'If you could change something about your personality, what would it be?',
                'What would you want to spend your free time doing? ',
                'What consistent income rate would you want to attain this year?',
                "What don't you have today that you desire to have?",
                'What financial milestone do you intend to reach within the next 3 years?',
                'What travel destination attracts you the most that you have not yet visited?',
                'What do you want to become excellent at to attain your overall goal for the year?',
                'What solution to a problem bothering have you not put to test?',
                'What would you like to write about to get your book published?',
                'What have you been thinking or talking about that you need to start acting on?	',
                'What activities can you do more often to make yourself happy?',
                'What can you improve in yourself to get better results in your career or business?',
                'What can you intend to accomplish in one year?	',
                'With adequate focus, what routine can contribute to your spiritual growth?',
                'What knowledge, skills, or experience do you want to develop this year?',
                'If you could have something that you don’t have today, what would that be?',
                'What ideas or knowledge would you like to express or share with people?',
                'What important item is missing in your household?',
                'If money is not an issue, what can you set out to achieve in the next 3 months?',
                'In what aspect of your life do you desire to make difference in the next 6 months?',
                'What actions could increase your chances of meeting your new partner?',
                'With more time, what food would you enjoy to learn to prepare?',
                'What is stopping you from getting the goals you want that you need to beat?',
                'What extreme sport have you dreamed of trying with your friends?',
                "What tangible thing do you wish you can have that you don't have now?",
                'What would you like to improve about your home?',
                'With more time, what dance would you like to learn or get better at?',
                'What new pet would can you consider to get?',
                'What car have you liked to buy or rent to drive around your country or another?',
                'If you had more time, what sport would you like to play more often?',
                'What city would you like to visit and spend all your day shopping?	',
                'If you had one chance, which living and famous person would you like to meet?',
                'What massive milestone would you like to reach at the moment?',
                'What milestone do you need to reach for you to feel you are living abundantly?',
            ],

            toastText: [],

            scrollEnabled: true,
            showGoalDescription: false,
            showMoreGoalInputs: false,
            keyword: '',
            tagSearchData: { ...INITIAL_TAG_SEARCH },
        }
        this.updateSearchRes = this.updateSearchRes.bind(this)
        this.handleLayoutChange = this.handleLayoutChange.bind(this)
        // this.scrollToEnd = this.scrollToEnd.bind(this)
        this.enableDescriptionInput = this.enableDescriptionInput.bind(this)
        this.enableMoreGoalInputs = this.enableMoreGoalInputs.bind(this)
    }

    componentDidMount() {
        this.initializeForm()
        // if (this.props.onRef !== null) {
        //     this.props.onRef(this)
        // }

        // const randome = this.state.randomText
        //     .map((person) => `${Math.random().toFixed(10)}${person}`)
        //     .sort()

        // const sliced = randome.map((data) => data.slice(12))
        // this.setState({ toastText: sliced })

        function shuffle(arr, first, last) {
            const newArr = arr.reduce((r, e, i) => {
                const pos = parseInt(Math.random() * (i + 1))
                r.splice(pos, 0, e)
                return r
            }, [])

            if (first)
                newArr.unshift(newArr.splice(newArr.indexOf(first), 1)[0])
            if (last) newArr.push(newArr.splice(newArr.indexOf(last), 1)[0])
            return newArr
        }

        const savedNumber = shuffle(
            this.state.RANDOM_TEXT,
            'What’s a goal that your friends would find interesting to discover about you?'
        )

        const savedSilverNumber = shuffle(
            this.state.RANDOM_TEXT_SILVER_BADGE,
            'What’s a goal that your friends would find interesting to discover about you?'
        )

        this.setState({
            RANDOM_TEXT: savedNumber,
            RANDOM_TEXT_SILVER_BADGE: savedSilverNumber,
        })
    }

    componentWillUnmount() {
        console.log(`${DEBUG_KEY}: unmounting NewGoalView`)
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }
    }

    /**
     * Scroll the form to the end
     */
    // scrollToEnd() {
    //     if (this.scrollView !== undefined) {
    //         this.scrollView.props.scrollToEnd()
    //     }
    // }

    handleLayoutChange = ({ nativeEvent }) => {
        console.log(
            `${DEBUG_KEY}: [ handleLayoutChange ]: layout: `,
            nativeEvent.layout
        )
    }

    /* Tag related functions */
    onTaggingSuggestionTap(item, hidePanel, cursorPosition) {
        hidePanel()
        const { name } = item
        const { details, tags } = this.props
        if (!details || _.isEmpty(details)) return
        const detail = details[0]

        const postCursorContent = detail.slice(cursorPosition)
        const prevCursorContent = detail.slice(0, cursorPosition)
        const content = prevCursorContent.slice(0, -this.state.keyword.length)
        const newContent = `${content}@${name} ${postCursorContent.replace(
            /^\s+/g,
            ''
        )}`
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        // console.log(`${DEBUG_KEY}: newContentText is: `, newContentText);
        this.props.change('details[0]', newContent)

        const newContentTag = {
            user: item,
            startIndex: content.length, // `${comment}@${name} `
            endIndex: content.length + 1 + name.length, // `${comment}@${name} `
            tagReg: `\\B@${name}`,
            tagText: `@${name}`,
        }

        // Clean up tags position before comparing
        const newTags = clearTags(newContent, newContentTag, tags)

        // Check if this tags is already in the array
        const containsTag = newTags.some(
            (t) =>
                t.tagReg === `\\B@${name}` &&
                t.startIndex === content.length + 1
        )

        const needReplceOldTag = newTags.some(
            (t) => t.startIndex === content.length
        )

        // Update comment contentTags regex and contentTags
        if (!containsTag) {
            let newContentTags
            if (needReplceOldTag) {
                newContentTags = newTags.map((t) => {
                    if (t.startIndex === newContentTag.startIndex) {
                        return newContentTag
                    }
                    return t
                })
            } else {
                newContentTags = [...newTags, newContentTag]
            }

            this.props.change(
                'tags',
                newContentTags.sort((a, b) => a.startIndex - b.startIndex)
            )
        }

        // Clear tag search data state
        this.setState({
            ...this.state,
            tagSearchData: { ...INITIAL_TAG_SEARCH },
        })
    }

    // This is triggered when a trigger (@) is removed. Verify if all tags
    // are still valid.
    validateContentTags = (change) => {
        const { tags, details } = this.props
        console.log(`${DEBUG_KEY}: details are: `, details)
        if (!details || _.isEmpty(details)) return
        const content = details[0]
        const newContentTags = tags.filter((tag) => {
            const { startIndex, endIndex, tagText } = tag

            const actualTag = content.slice(startIndex, endIndex)
            // Verify if with the same startIndex and endIndex, we can still get the
            // tag. If not, then we remove the tag.
            return actualTag === tagText
        })
        change('tags', newContentTags)
    }

    updateSearchRes(res, searchContent) {
        // console.log(`${DEBUG_KEY}: res is: `, res);
        // console.log(`${DEBUG_KEY}: keyword is: `, this.state.keyword);
        // console.log(`${DEBUG_KEY}: searchContent is: `, searchContent);
        if (searchContent !== this.state.keyword) return
        this.setState({
            ...this.state,
            // keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                skip: res.data.length, //TODO: new skip
                data: res.data,
                loading: false,
            },
        })
    }

    triggerCallback(keyword) {
        if (this.reqTimer) {
            clearTimeout(this.reqTimer)
        }

        this.reqTimer = setTimeout(() => {
            console.log(`${DEBUG_KEY}: requesting for keyword: `, keyword)
            this.setState({
                ...this.state,
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    loading: true,
                },
            })
            const { limit } = this.state.tagSearchData
            this.props.searchUser(keyword, 0, limit, (res, searchContent) => {
                this.updateSearchRes(res, searchContent)
            })
        }, 150)
    }

    handleTagSearchLoadMore = () => {
        const { tagSearchData, keyword } = this.state
        const { skip, limit, data, loading } = tagSearchData

        if (loading) return
        this.setState({
            ...this.state,
            keyword,
            tagSearchData: {
                ...this.state.tagSearchData,
                loading: true,
            },
        })

        this.props.searchUser(keyword, skip, limit, (res) => {
            this.setState({
                ...this.state,
                keyword,
                tagSearchData: {
                    ...this.state.tagSearchData,
                    skip: skip + res.data.length, //TODO: new skip
                    data: arrayUnique([...data, ...res.data]),
                    loading: false,
                },
            })
        })
    }
    /* Tag related functions end */

    initializeForm() {
        const values = [{ isCompleted: false }]
        const defaulVals = {
            steps: [...values],
            needs: [...values],
            shareToMastermind: true,
            category: 'General',
            privacy: PRIVACY_FRIENDS,
            priority: 5,
            hasTimeline: false,
            startTime: { date: undefined, picker: false },
            endTime: { date: undefined, picker: false },
            title: '' || this.props.title,
            tags: [],
        }

        // Initialize based on the props, if it's opened through edit `button`
        const { initializeFromState, goal, isImportedGoal } = this.props
        const initialVals =
            initializeFromState || isImportedGoal
                ? { ...goalToFormAdaptor(goal) }
                : { ...defaulVals }
        if (initializeFromState || isImportedGoal) {
            this.setState({
                showGoalDescription: true,
                showMoreGoalInputs: true,
            })
        }
        // console.log('initial values are: ', initialVals);
        this.props.initialize({
            ...initialVals,
        })
    }

    handleCatergoryOnSelect = (value) => {
        console.log('category selected is: ', value)
        // trackWithProperties(EVENT.GOAL_CREATED, {
        //     category: value,
        // })
        this.props.change('category', value)
    }

    handlePriorityOnSelect = (value) => {
        // console.log('priority selected is: ', value);
        this.props.change('priority', value)
    }

    renderTagSearchLoadingComponent(loading) {
        if (loading) {
            return (
                <View style={styles.activityIndicatorStyle}>
                    <ActivityIndicator />
                </View>
            )
        }
        return (
            <EmptyResult
                text={'No User Found'}
                textStyle={{ paddingTop: 15, height: 50 }}
            />
        )
    }

    /**
     * This is to render tagging suggestion row
     * @param hidePanel: lib passed in funct to close suggestion panel
     * @param item: suggestion item to render
     */
    renderSuggestionsRow({ item }, hidePanel, cursorPosition) {
        const { name } = item
        return (
            <TouchableOpacity
                onPress={() =>
                    this.onTaggingSuggestionTap(item, hidePanel, cursorPosition)
                }
                style={{
                    height: 50,
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                }}
            >
                <ProfileImage
                    imageContainerStyle={styles.imageContainerStyle}
                    imageUrl={getProfileImageOrDefaultFromUser(item)}
                    imageStyle={{ height: 30, width: 30 }}
                />
                <Text style={{ fontSize: 16, color: 'darkgray' }}>{name}</Text>
            </TouchableOpacity>
        )
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
            change,
        } = props

        const { tags } = this.props

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
                    flexGrowDirection="bottom"
                    suggestionPosition="bottom"
                    textInputContainerStyle={{ ...styles.inputContainerStyle }}
                    textInputStyle={style}
                    validateTags={() => this.validateContentTags(change)}
                    autoCorrect
                    suggestionsPanelStyle={{ backgroundColor: '#f8f8f8' }}
                    loadingComponent={() =>
                        this.renderTagSearchLoadingComponent(loading)
                    }
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
        )
    }

    /**
     *
     * @param {object} user
     * @param {boolean} isEdit: initializeFromState to determine if this is editing a goal
     */
    renderPrivacyControl() {
        return (
            <View>
                <InputBox
                    privacyOptions={PRIVACY_OPTIONS}
                    inputTitle={'Privacy'}
                    required={false}
                    selectedValue={this.props.privacy}
                    onChangeText={(value) => {
                        this.props.change('privacy', value)
                    }}
                />
            </View>
        )
    }

    renderGoal() {
        const { title, isFirstTimeCreateGoal } = this.props
        return (
            <CopilotStep
                text={this.props.tutorialText[1]}
                order={1}
                name="create_goal_create_goal_modal_1"
            >
                <WalkableView>
                    {/* <FieldTitleText
                        text={
                            isFirstTimeCreateGoal
                                ? 'What’s a goal that your friends may not know you have?'
                                : 'What are you looking to achieve?'
                        }
                        required={false}
                        containerStyle={{ marginBottom: 16 }}
                    /> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ top: 4, color: '#828282' }}>*</Text>
                            <FieldTitleText
                                text="My goal is to:"
                                textStyle={[styles.subTitleTextStyle]}
                                // required={true}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => Actions.push('trendingGoalView')}
                        >
                            <Text
                                style={{
                                    textDecorationLine: 'underline',
                                    fontSize: 10,
                                    color: color.GM_BLUE_DEEP,
                                    fontWeight: '600',
                                }}
                            >
                                View Trending Goals
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Field
                        name="title"
                        label="title"
                        component={InputField}
                        editable={this.props.uploading}
                        style={{
                            ...styles.standardInputStyle,
                        }}
                        inputContainerStyle={{
                            borderColor: color.GM_MID_GREY,
                        }}
                        placeholder="Make your goal as specific as possible"
                        autoCorrect
                        autoFocus={true}
                        autoCapitalize={'sentences'}
                        multiline
                        blurOnSubmit
                        props={{ prefilled: this.props.prefilledTitle }}
                        // onEndEditing={() =>
                        //     trackWithProperties(EVENT.GOAL_CREATED, {
                        //         goal_title: this.props.title,
                        //     })
                        // }
                        maxLength={90}
                    />
                    {/* <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <View style={{ marginTop: 5 }}>
                            <Icon
                                pack="material-community"
                                name="lightbulb-on-outline"
                                style={{
                                    height: 15,
                                    width: 15,
                                    tintColor: '#828282',
                                }}
                            />
                        </View>

                        <Text style={styles.descriptionTextStyle}>
                            For what exciting achievement would you celebrate by
                            throwing a big party?{' '}
                        </Text>
                    </View> */}
                </WalkableView>
            </CopilotStep>
        )
    }

    renderGoalDescription = ({ fields }) => {
        const { details } = this.props
        if (fields.length === 0) fields.push({})

        return fields.map((description, index) => {
            return (
                <WalkableView>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 16,
                        }}
                    >
                        <Text style={styles.subTitleTextStyle}>
                            More Details{' '}
                        </Text>
                    </View>
                    <Field
                        key={`goal-description=${index}`}
                        name={description}
                        component={this.renderInput}
                        editable={this.props.uploading}
                        style={{
                            ...styles.standardInputStyle,
                            paddingLeft: 15,
                            paddingRight: 15,
                            // Should approximately match numberOfLines * fontSize height + padding
                            maxHeight: 200,
                            minHeight: 80,
                        }}
                        numberOfLines={5}
                        placeholder="Share some more info about your goals..."
                        multiline
                        loading={this.state.tagSearchData.loading}
                        tagData={this.state.tagSearchData.data}
                        keyword={this.state.keyword}
                        change={(type, val) => this.props.change(type, val)}
                    />

                    {/* {!this.state.detailsFieldShow ? (
                        <Button
                            text={'Tap to add more details'}
                            source={plus}
                            onPress={() =>
                                this.setState({ detailsFieldShow: true })
                            }
                            containerStyle={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: color.GM_CARD_BACKGROUND,
                                borderWidth: 1.5,
                                borderRadius: 3,
                                borderColor: '#F3F3F3',
                                padding: 10,
                            }}
                            iconStyle={{
                                ...default_style.smallIcon_1,
                                backgroundColor: 'transparent',
                                tintColor: '#999999',
                            }}
                            textStyle={{
                                ...default_style.titleText_1,
                                color: '#999999',
                            }}
                        />
                    ) : null} */}
                </WalkableView>
            )
        })
    }

    renderCategory = () => {
        const menu = MenuFactory(
            [
                'General',
                'Career/Business',
                'Charity/Philanthropy',
                'Financial/Wealth',
                'Health/Wellness',
                'Learning/Mindset',
                'Personal/Relationships',
                'Spiritual',
                'Travel',
                'Things to Buy',
            ],
            this.handleCatergoryOnSelect,
            this.props.category,
            styles.triggerContainerStyle,
            () => console.log('animationCallback')
        )

        return (
            <CopilotStep
                text={this.props.tutorialText[2]}
                order={2}
                name="create_goal_create_goal_modal_2"
            >
                <WalkableView
                    style={{
                        marginTop: 20,
                        justifyContent: 'flex-start',
                        flex: 1,
                        color: '#828282',
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ top: 4, color: '#828282' }}>*</Text>
                        <Text style={styles.subTitleTextStyle}>Category</Text>
                    </View>

                    {menu}
                </WalkableView>
            </CopilotStep>
        )
    }

    toggleState = (id) => {
        let updatedList = this.state.sliderNumbers.map((x) => {
            if (x.id === id) {
                x.active = true
            } else {
                x.active = false
            }

            return x
        })
        this.setState({
            sliderNumbers: updatedList,
        })
    }

    renderPriority = () => {
        const THUMB_COLORS = ['#219653', '#F07E1A', '#D71919']
        const TRACK_COLORS = ['#27AE60', '#F2994A', '#EB5757']
        // const SLIDER_NUMS = [
        //     { id: 10, letter: '10', value: 10, active: false },
        //     { id: 9, letter: '9', value: 9, active: false },
        //     { id: 8, letter: '8', value: 8, active: false },
        //     { id: 7, letter: '7', value: 7, active: false },
        //     { id: 6, letter: '6', value: 6, active: false },
        //     { id: 5, letter: '5', value: 5, active: false },
        //     { id: 4, letter: '4', value: 4, active: false },
        //     { id: 3, letter: '3', value: 3, active: false },
        //     { id: 2, letter: '2', value: 2, active: false },
        //     { id: 1, letter: '1', value: 1, active: false },
        // ]
        let colorIndex = 0
        if (this.props.priority <= 3) colorIndex = 0
        else if (this.props.priority <= 6) colorIndex = 1
        else colorIndex = 2

        const slider = (
            <Slider
                value={this.props.priority}
                onValueChange={(value) => this.handlePriorityOnSelect(value)}
                step={1}
                minimumValue={0}
                maximumValue={10}
                disabled={!this.props.uploading}
                trackStyle={{ height: 10, backgroundColor: '#F2F2F2' }}
                minimumTrackTintColor={TRACK_COLORS[colorIndex]}
                thumbStyle={{
                    width: 12,
                    height: 20,
                    backgroundColor: THUMB_COLORS[colorIndex],
                }}
            />
        )

        return (
            <CopilotStep
                text={this.props.tutorialText[3]}
                order={3}
                name="create_goal_create_goal_modal_3"
            >
                <WalkableView
                    style={{
                        marginTop: 20,
                        justifyContent: 'flex-start',
                        flex: 1,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ top: 4, color: '#828282' }}>*</Text>
                        <Text style={styles.subTitleTextStyle}>
                            How important is your goal?
                        </Text>
                    </View>

                    {/* <Text style={styles.descriptionTextStyle}>
                        Use this to set relative priority of your Goal.
                    </Text>
                    {slider} */}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginTop: 15,
                        }}
                    >
                        <ScrollView
                            horizontal
                            style={{ width: 100 }}
                            showsHorizontalScrollIndicator={false}
                        >
                            {this.state.sliderNumbers.map((val, index) => {
                                return (
                                    <TouchableOpacity
                                        key={`priority-${index}`}
                                        onPress={() => {
                                            this.toggleState(val.id)
                                            this.handlePriorityOnSelect(
                                                val.value
                                            )
                                            // trackWithProperties(
                                            //     EVENT.GOAL_CREATED,
                                            //     {
                                            //         goal_importance: val.value,
                                            //     }
                                            // )
                                        }}
                                    >
                                        <View
                                            style={{
                                                borderColor: val.active
                                                    ? '#42C0F5'
                                                    : '#828282',
                                                borderWidth: 0.5,
                                                borderRadius: 50,
                                                width: 35,
                                                height: 35,
                                                marginHorizontal: 5,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: val.active
                                                    ? '#42C0F5'
                                                    : 'transparent',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: val.active
                                                        ? 'white'
                                                        : '#828282',
                                                }}
                                            >
                                                {val.letter}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </WalkableView>
            </CopilotStep>
        )
    }

    // Renderer for timeline
    renderTimeline = () => {
        if (this.props.startTime === undefined) return

        const newPicker = true
        const startDatePicker = newPicker ? (
            <DateTimePickerModal
                date={new Date()}
                isVisible={this.props.startTime.picker}
                mode="date"
                display="inline"
                onConfirm={(date) => {
                    if (validateTime(date, this.props.endTime.date)) {
                        this.props.change('startTime', { date, picker: false })
                        // trackWithProperties(EVENT.GOAL_CREATED, {
                        //     start_date: date,
                        // })
                        return
                    }
                    setTimeout(() => {
                        Alert.alert('Start time cannot be later than end time')
                    }, 500)
                    this.props.change('startTime', {
                        date: this.props.endTime.date,
                        picker: false,
                    })
                }}
                // display="spinner"
                onCancel={() =>
                    this.props.change('startTime', {
                        date: this.props.startTime.date,
                        picker: false,
                    })
                }
            />
        ) : null
        // <Modal
        //     animationType="fade"
        //     transparent={false}
        //     visible={this.props.startTime.picker}
        // >
        //     <ModalHeader
        //         title="Select start time"
        //         actionText="Done"
        //         onAction={() =>
        //             this.props.change('startTime', {
        //                 date: this.props.startTime.date,
        //                 picker: false,
        //             })
        //         }
        //         onCancel={() =>
        //             this.props.change('startTime', {
        //                 date: this.props.startTime.date,
        //                 picker: false,
        //             })
        //         }
        //     />

        // </Modal>

        const endDatePicker = newPicker ? (
            <DateTimePickerModal
                isVisible={this.props.endTime.picker}
                date={new Date()}
                display="inline"
                onConfirm={(date) => {
                    if (validateTime(this.props.startTime.date, date)) {
                        this.props.change('endTime', { date, picker: false })
                        return
                    }

                    setTimeout(() => {
                        Alert.alert('End time cannot be early than start time')
                    }, 500)

                    this.props.change('endTime', {
                        date: this.props.startTime.date,
                        picker: false,
                    })
                }}
                mode="date"
                onCancel={() =>
                    this.props.change('endTime', {
                        date: this.props.endTime.date,
                        picker: false,
                    })
                }
                isDarkModeEnabled={false}
            />
        ) : (
            <Modal
                animationType="fade"
                transparent={false}
                visible={this.props.endTime.picker}
            >
                <ModalHeader
                    title="Select end time"
                    actionText="Done"
                    onAction={() =>
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false,
                        })
                    }
                    onCancel={() =>
                        this.props.change('endTime', {
                            date: this.props.endTime.date,
                            picker: false,
                        })
                    }
                />
                <View style={{ flex: 1 }}>
                    <DatePickerIOS
                        date={this.props.endTime.date}
                        onDateChange={(date) =>
                            this.props.change('endTime', { date, picker: true })
                        }
                        mode="date"
                    />
                </View>
            </Modal>
        )

        const startTime = (
            <Text
                style={{
                    ...default_style.subTitleText_1,
                    marginRight: 8,
                }}
            >
                {this.props.startTime.date
                    ? moment(this.props.startTime.date).format(' MMM D, YY')
                    : ' Start Date'}
            </Text>
        )
        const endTime = (
            <Text
                style={{
                    ...default_style.subTitleText_1,
                    marginRight: 8,
                }}
            >
                {this.props.endTime.date
                    ? moment(this.props.endTime.date).format(' MMM D, YY')
                    : ' End Date'}
            </Text>
        )

        const icon = (
            <View
                style={{
                    height: 40 * default_style.uiScale,
                    width: default_style.buttonIcon_1.width + 5,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Icon
                    name="calendar-blank-outline"
                    pack="material-community"
                    style={[
                        default_style.buttonIcon_1,
                        { tintColor: '#DADADA' },
                    ]}
                />
            </View>
        )

        // Show cancel button if there is date set
        const cancelButton =
            this.props.endTime.date || this.props.startTime.datem ? (
                <TouchableOpacity
                    activeOpacity={0.6}
                    style={{
                        justifyContent: 'center',
                        padding: 10,
                        marginLeft: 5,
                    }}
                    onPress={() => {
                        this.props.change('hasTimeline', false)
                        this.props.change('endTime', {
                            date: undefined,
                            picker: false,
                        })
                        this.props.change('startTime', {
                            date: undefined,
                            picker: false,
                        })
                    }}
                >
                    <Image
                        source={cancel}
                        resizeMode="contain"
                        style={default_style.buttonIcon_1}
                    />
                </TouchableOpacity>
            ) : null

        return (
            <CopilotStep
                text={this.props.tutorialText[4]}
                order={4}
                name="create_goal_create_goal_modal_4"
            >
                <WalkableView>
                    {/* <FieldTitleText
                        text="Timeline"
                        required={false}
                        containerStyle={{ marginBottom: 12 }}
                    /> */}
                    {/* <Text style={styles.descriptionTextStyle}>
                        Give your best estimate.
                    </Text> */}
                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 8,
                        }}
                    >
                        <View style={{ position: 'absolute', left: 0 }}>
                            <Text style={{ color: '#333333' }}>Start</Text>
                        </View>
                        <View style={{ right: 125, position: 'absolute' }}>
                            <Text
                                style={{
                                    color: '#333333',
                                }}
                            >
                                End
                            </Text>
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 8,
                            flexDirection: 'row',
                            // flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                height: 40 * default_style.uiScale,
                                flexDirection: 'row',
                                alignItems: 'center',
                                ...styles.borderStyle,
                                width: 150,
                            }}
                            onPress={() =>
                                this.props.change('startTime', {
                                    date:
                                        this.props.startTime.date || new Date(),
                                    picker: true,
                                })
                            }
                        >
                            {icon}
                            {startTime}
                        </TouchableOpacity>
                        <Image
                            style={{ margin: 8, ...default_style.normalIcon_1 }}
                            source={arrowRight}
                        />
                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={{
                                height: 40 * default_style.uiScale,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                ...styles.borderStyle,
                                width: 150,
                            }}
                            onPress={() =>
                                this.props.change('endTime', {
                                    date: this.props.endTime.date || new Date(),
                                    picker: true,
                                })
                            }
                        >
                            {icon}
                            {endTime}
                        </TouchableOpacity>
                        {/* {cancelButton} */}
                    </View>
                    {startDatePicker}
                    {endDatePicker}
                </WalkableView>
            </CopilotStep>
        )
    }

    /**
     * type: ['step', 'need']
     */
    renderFieldArrayItem = (
        props,
        placeholder,
        fields,
        canDrag,
        type,
        onSubmitEditing
    ) => {
        const { item, index, drag, isActive } = props
        const iconOnPress = () => fields.remove(index)
        return (
            <Field
                key={`description-${index}`}
                name={`${item.item}.description`}
                component={InputField}
                editable={this.props.uploading}
                numberOfLines={4}
                style={styles.standardInputStyle}
                placeholder={placeholder}
                iconSource={cancel}
                iconStyle={default_style.normalIcon_1}
                iconOnPress={iconOnPress}
                move={drag}
                blurOnSubmit
                moveEnd={drag}
                canDrag={canDrag}
                autoCorrect
                autoCapitalize={'sentences'}
                index={index}
                type={type}
                multiline
                onSubmitEditing={onSubmitEditing}
                inputContainerStyle={{
                    backgroundColor: isActive
                        ? '#F2F2F2'
                        : color.GM_CARD_BACKGROUND,
                }}
            />
        )
    }

    renderFieldArray = (type, fields, error) => {
        const onSubmitEditing = ({ nativeEvent }) => {
            const { text } = nativeEvent
            if (text && text.trim() !== '') {
                fields.push({ isCompleted: false })
            }
        }

        let dataToRender = []
        fields.forEach((field, index) => {
            const dataToPush = {
                item: _.cloneDeep(field),
                index,
            }
            dataToRender.push(dataToPush)
        })

        return (
            <View style={styles.sectionMargin}>
                <FieldTitleText
                    text={TYPE_MAP[type].title}
                    required={false}
                    containerStyle={{ marginBottom: 12 }}
                />
                <Text style={{ color: '#828282' }}>{TYPE_MAP[type].text}</Text>

                {fields.length > 0 ? (
                    <DraggableFlatlist
                        renderItem={(props) =>
                            this.renderFieldArrayItem(
                                props,
                                TYPE_MAP[type].placeholder,
                                fields,
                                true,
                                type,
                                onSubmitEditing
                            )
                        }
                        data={dataToRender}
                        keyExtractor={(item) => `${item.index}`}
                        onDragEnd={(e) => {
                            // console.log('moving end for e: ', e);
                            fields.move(e.from, e.to)
                            this.setState({
                                scrollEnabled: true,
                            })
                        }}
                        onDragBegin={(index) => {
                            // console.log('index is being moved: ', index);
                            this.setState({
                                scrollEnabled: false,
                            })
                        }}
                    />
                ) : null}
                <Button
                    text={TYPE_MAP[type].buttonText}
                    source={plus}
                    onPress={() => {
                        // trackWithProperties(
                        //     EVENT.GOAL_CREATED,
                        //     TYPE_MAP[type].segmentsValue
                        // )
                        fields.push({})
                    }}
                    containerStyle={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        borderWidth: 1,
                        borderRadius: 3,
                        borderColor: color.GM_BLUE,
                        padding: 10,
                    }}
                    iconStyle={{
                        ...default_style.smallIcon_1,
                        backgroundColor: color.GM_CARD_BACKGROUND,
                        tintColor: color.GM_BLUE,
                    }}
                    textStyle={{
                        ...default_style.titleText_1,
                        color: color.GM_BLUE,
                        marginLeft: 15,
                    }}
                />
            </View>
        )
    }

    renderSteps = ({ fields, meta: { error, submitFailed } }) => {
        return (
            <CopilotStep
                text={this.props.tutorialText[5]}
                order={5}
                name="create_goal_create_goal_modal_5"
            >
                <WalkableView>
                    {this.renderFieldArray('step', fields, error)}
                </WalkableView>
            </CopilotStep>
        )
    }

    renderNeeds = ({ fields, meta: { error, submitFailed } }) => {
        return this.renderFieldArray('need', fields, error)
    }

    enableDescriptionInput() {
        this.setState({
            showGoalDescription: true,
        })
    }

    enableMoreGoalInputs() {
        this.setState({
            showMoreGoalInputs: true,
        })
    }

    // renderCarousalItem({ item }) {
    //     return <CreateGaolMdalToast randomText={item} />
    // }

    _renderItem = ({ item, index }) => {
        return (
            // <View style={styles.itemContainer}>
            //     <CreateGaolMdalToast randomText={item} />
            // </View>

            <View style={styles.itemContainer}>
                <Text style={styles.itemLabel}>{`Item ${item}`}</Text>
            </View>
        )
    }
    render() {
        const { initializeFromState, title } = this.props

        return (
            <KeyboardAwareScrollView
                scrollEnabled={this.state.scrollEnabled}
                extraHeight={100}
                // enableResetScrollToCoords={false}
                innerRef={(r) => {
                    this.scrollView = r
                }}
            >
                {/* <View
                    style={{
                        padding: 24,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                        }}
                    >
                        <Text style={default_style.subTitleText_1}>
                            Need some help forming your Goal?
                        </Text>
                        <Button
                            text="View Trending Goals"
                            containerStyle={{
                                backgroundColor: color.GM_BLUE,
                                alignSelf: 'flex-start',
                                paddingLeft: 16,
                                paddingRight: 16,
                                marginTop: 16,
                            }}
                            textStyle={{
                                ...default_style.titleText_1,
                                color: 'white',
                            }}
                            onPress={() => Actions.push('trendingGoalView')}
                        />
                    </View>
                    <View>
                        <Image
                            source={LionWithLightbulb}
                            style={{
                                height: 99,
                                width: 90,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                </View> */}

                {/* Spacer */}
                {/* <View
                    style={[
                        {
                            height: 8 * default_style.uiScale,
                            width: '100%',
                            backgroundColor: color.GM_LIGHT_GRAY,
                        },
                    ]}
                /> */}

                {/* {this.props.currentstatebottom === 2 ? ( */}
                <CreateGoalToast
                    randomText={this.state.RANDOM_TEXT}
                    randomSilverText={this.state.RANDOM_TEXT_SILVER_BADGE}
                />
                {/* ) : ( */}
                {/* <></>
                )} */}

                {/* Primary form */}
                <View style={{ padding: 10, flex: 1 }}>
                    {this.renderGoal()}
                    {this.state.showGoalDescription ? (
                        <FieldArray
                            name="details"
                            component={this.renderGoalDescription}
                            loading={this.state.tagSearchData.loading}
                            tagData={this.state.tagSearchData.data}
                            keyword={this.state.keyword}
                        />
                    ) : (
                        <Button
                            text={'Tap to add more details'}
                            source={plus}
                            onPress={this.enableDescriptionInput}
                            containerStyle={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: color.GM_CARD_BACKGROUND,
                                borderWidth: 1.5,
                                borderRadius: 3,
                                borderColor: '#F3F3F3',
                                padding: 10,
                            }}
                            iconStyle={{
                                ...default_style.smallIcon_1,
                                backgroundColor: 'transparent',
                                tintColor: '#999999',
                            }}
                            textStyle={{
                                ...default_style.titleText_1,
                                color: '#999999',
                            }}
                        />
                    )}
                    {this.renderCategory()}
                    {this.renderPriority()}
                    {this.renderPrivacyControl(initializeFromState)}
                </View>

                {/* Spacer */}
                {/* <View
                    style={[
                        {
                            height: 8 * default_style.uiScale,
                            width: '100%',
                            backgroundColor: color.GM_LIGHT_GRAY,
                        },
                    ]}
                /> */}

                {/* Secondary form */}
                {/* {this.props.currentstatebottom === 2 ? ( */}
                <View
                    style={{
                        padding: 20,
                        flex: 1,
                        // marginBottom: 30,
                    }}
                >
                    {!this.state.showMoreGoalInputs ? (
                        <TouchableWithoutFeedback
                            onPress={this.enableMoreGoalInputs}
                        >
                            <Text
                                style={{
                                    marginTop: 8,
                                    marginBottom: 8,
                                    ...default_style.buttonText_1,
                                    color: color.GM_MID_GREY,
                                }}
                            >
                                + Add a Timeline, Steps or Needs
                            </Text>
                        </TouchableWithoutFeedback>
                    ) : null}
                    {this.state.showMoreGoalInputs
                        ? this.renderTimeline()
                        : null}
                    {this.state.showMoreGoalInputs ? (
                        <View
                        // ref={(r) => {
                        //     this.view = r
                        // }}
                        // style={{ bottom: 60 }}
                        >
                            <FieldArray
                                name="steps"
                                component={this.renderSteps}
                            />

                            <FieldArray
                                name="needs"
                                component={this.renderNeeds}
                            />
                        </View>
                    ) : null}
                </View>
                {/* ) : (
                    <></>
                )} */}
                <View style={{ marginBottom: 40 }}>
                    <Button
                        text={this.props.createButtonTitle}
                        // source={plus}

                        buttonDisabled={this.props.actionDisabled}
                        onPress={() => this.props.handleCreateButton()}
                        containerStyle={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: this.props.actionDisabled
                                ? '#F4F0F0'
                                : color.GM_BLUE,
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: this.props.actionDisabled
                                ? 'transparent'
                                : color.GM_BLUE,
                            padding: 10,
                            marginRight: 20,
                        }}
                        textStyle={{
                            ...default_style.titleText_1,
                            color: 'white',
                            marginLeft: 15,
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const FieldTitleText = (props) => {
    const { text, containerStyle, textStyle, required } = props
    return (
        <View style={{ flexDirection: 'row', ...containerStyle }}>
            {required && (
                <Text
                    style={{
                        ...styles.subTitleTextStyle,
                        ...textStyle,
                        color: 'red',
                        paddingRight: 0,
                    }}
                >
                    *
                </Text>
            )}
            <Text style={[styles.titleTextStyle, textStyle]}>{text}</Text>
        </View>
    )
}

const validateTime = (start, end) => {
    if (!start || !end) return true
    if (moment(start) > moment(end)) return false
    return true
}

const styles = {
    activityIndicatorStyle: {
        flex: 1,
        height: 50 * default_style.uiScale,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userImageContainerStyle: {
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: 'white',
    },
    imageContainerStyle: {
        alignItems: 'center',
        borderRadius: 100,
        alignSelf: 'center',
        backgroundColor: 'white',
        margin: 5,
    },
    sectionMargin: {
        marginTop: 40,
    },
    inputContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#E0E0E0',
    },
    titleTextStyle: {
        ...default_style.titleText_1,
        padding: 2,
    },
    subTitleTextStyle: {
        ...default_style.titleText_2,
        padding: 2,
        color: '#828282',
    },
    descriptionTextStyle: {
        ...default_style.normalText_1,
        padding: 2,
        color: '#828282',
    },
    standardInputStyle: {
        flex: 1,
        ...default_style.subTitleText_1,
        padding: 12,
        paddingTop: 12,
        paddingRight: 12,
        paddingLeft: 12,
        marginHorizontal: 8,
    },
    caretStyle: {
        ...default_style.smallIcon_1,
        marginRight: 12,
        tintColor: '#333',
    },
    borderStyle: {
        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    // Menu related style

    triggerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#E0E0E0',
    },
    anchorStyle: {
        backgroundColor: 'white',
    },
    menuOptionsStyles: {
        optionsContainer: {
            padding: 5,
            height: height * 0.45,
            width: width * 0.9,
            // width: '100%',
            bottom: 25,
            // left: 50,
        },
        optionWrapper: {
            flex: 1,
        },
        optionsContainerStyle: {},
        optionTouchable: {
            underlayColor: 'lightgray',
            activeOpacity: 10,
        },
        optionText: {
            ...default_style.subTitleText_1,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 10,
            paddingRight: 10,
        },
        carouselContainer: {
            marginTop: 50,
        },
    },
}

NewGoalView = reduxForm({
    form: 'createGoalModal',
    enableReinitialize: true,
})(NewGoalView)

const mapStateToProps = (state) => {
    const selector = formValueSelector('createGoalModal')
    const { user } = state.user
    const { profile } = user
    const { uploading } = state.createGoal

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
        uploading,
    }
}

export default connect(mapStateToProps, {
    submitGoal,
    searchUser,
})(NewGoalView)

const MenuFactory = (
    options,
    callback,
    triggerText,
    triggerContainerStyle,
    animationCallback
) => {
    return (
        <Menu
            onSelect={(value) => callback(value)}
            rendererProps={{
                placement: 'auto',
                anchorStyle: styles.anchorStyle,
            }}
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
                        style={{
                            ...default_style.subTitleText_1,
                            margin: 10,
                            flex: 1,
                        }}
                    >
                        {triggerText}
                    </Text>
                    <Image
                        resizeMode="contain"
                        style={styles.caretStyle}
                        source={dropDown}
                    />
                </View>
            </MenuTrigger>
            <MenuOptions customStyles={styles.menuOptionsStyles}>
                <FlatList
                    data={options}
                    renderItem={({ item }) => (
                        <MenuOption value={item} text={item} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    // style={{ height: 200, }}
                />
            </MenuOptions>
        </Menu>
    )
}
