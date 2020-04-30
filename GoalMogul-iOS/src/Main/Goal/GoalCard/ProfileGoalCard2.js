/**
 * This component corresponds to My Goals2.2-1 design. New user page
 * condensed goal layout
 */
import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import timeago from 'timeago.js';
import _ from 'lodash';

// Components
import Timestamp from '../Common/Timestamp';
import ProgressBar from '../Common/ProgressBar';
import Category from '../Common/Category';
import PriorityBar from '../../Common/PriorityBar';
import DelayedButton from '../../Common/Button/DelayedButton';

// Assets
import LoveIcon from '../../../asset/utils/love.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';

// Actions
import {
    openGoalDetail
} from '../../../redux/modules/home/mastermind/actions';
import { IS_ZOOMED } from '../../../Utils/Constants';
import { GM_FONT_FAMILY_2, GM_FONT_FAMILY_1, GM_FONT_1 } from '../../../styles';

class ProfileGoalCard2 extends React.Component {

    /* Handler functions for actions */

    /**
     * Open Goal Detail page on Card pressed
     */
    handleOnCardPress = (item) => {
        this.props.openGoalDetail(item);
    }

    /* Renderers for views */

    /**
     * This method renders category and timestamp
     */
    renderHeader(item) {
        const { category, created } = item;
        return (
            <View style={styles.headerContainerStyle}>
                <View style={{ alignSelf: 'center', alignItems: 'center' }}>
                    <Text style={{
                        fontSize: 11,
                        fontFamily: GM_FONT_FAMILY_1,
                        color: '#3B414B',
                        alignSelf: 'center',
                        letterSpacing: 0.7
                    }}>
                        {category}
                    </Text>
                </View>
                <View style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                }}>
                    <Timestamp time={timeago().format(created)} />
                </View>
            </View>
        );
    }

    /**
     * This method renders goal title
     */
    renderTitle(item) {
        const { title } = item;
        return (
            <Text
                style={{
                    flex: 1,
                    flexWrap: 'wrap',
                    fontSize: GM_FONT_1,
                    color: '#3B414B',
                    fontFamily: GM_FONT_FAMILY_2
                }}
                numberOfLines={1}
                ellipsizeMode='tail'
            >
                {title}
            </Text>
        );
    }

    renderProgressBar(item) {
        const { start, end, steps, needs } = item;
        return (
            <View style={{ marginTop: 12 }}>
                <ProgressBar
                    startTime={start}
                    endTime={end}
                    steps={steps}
                    needs={needs}
                    goalRef={item}
                    barHeight={11}
                    sections={6}
                    isProfileGoalCard
                    size='small'
                />
            </View>
        );
    }

    /**
     * THis method renders stats including like, forward and suggestion count
     */
    renderStats(item) {
        const likeCount = item.likeCount ? item.likeCount : 0;
        const commentCount = item.commentCount ? item.commentCount : 0;
        const shareCount = item.shareCount ? item.shareCount : 0;

        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <StatsComponent
                        iconSource={LoveIcon}
                        iconStyle={styles.loveIconStyle}
                        text={likeCount}
                        textStyle={styles.loveTextStyle}
                    />
                    <StatsComponent
                        iconSource={ShareIcon}
                        iconStyle={styles.shareIconStyle}
                        text={shareCount}
                        textStyle={styles.shareTextStyle}
                    />
                </View>
                <StatsComponent
                    iconSource={CommentIcon}
                    iconStyle={styles.commentIconStyle}
                    text={commentCount + ' Comment' + (commentCount !== 1 ? 's' : '')}
                    textStyle={styles.commentTextStyle}
                />
            </View>
        );
    }

    renderPriorityBar(item) {
        const { priority } = item;
        return (
            <View style={{ alignItems: 'center', marginLeft: 16 }}>
                <Text style={styles.priorityTextStyle}>Priority</Text>
                <PriorityBar priority={priority} />
            </View>
        );
    }

    render() {
        const { item } = this.props;
        if (!item || _.isEmpty(item)) return null;

        // const cardOpacity = item.isCompleted ? 0.5 : 1;
        const cardOpacity = 1;
        const backgroundColor = item.isCompleted ? '#F6F6F6' : 'white';
        return (
            <DelayedButton
                activeOpacity={0.6}
                style={[styles.cardContainerStyle, { opacity: cardOpacity, backgroundColor }]}
                onPress={() => this.handleOnCardPress(item)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        {this.renderHeader(item)}
                        {this.renderTitle(item)}
                        {this.renderProgressBar(item)}
                    </View>
                    {this.renderPriorityBar(item)}
                </View>
                {this.renderStats(item)}
            </DelayedButton>
        );
    }
}

const StatsComponent = (props) => {
    const { iconStyle, textStyle, iconSource, text } = props;
    const { statsTextDefaultStyle, statsIconDefaultStyle } = styles;
    return (
        <View style={{ marginTop: 5, marginBottom: 5, flexDirection: 'row' }}>
            <Image source={iconSource} style={{ ...statsIconDefaultStyle, ...iconStyle }} />
            <Text style={{ ...statsTextDefaultStyle, ...textStyle }}>{text}</Text>
        </View>
    );
};

const styles = {
    cardContainerStyle: {
        marginBottom: 2,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 2,
        shadowColor: 'lightgray',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
        elevation: 1,
    },
    headerContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 8
    },
    priorityTextStyle: {
        fontSize: 8,
        fontStyle: 'italic',
        fontFamily: GM_FONT_FAMILY_2,
        color: '#3B414B'
    },
    // Stats component default style
    statsTextDefaultStyle: {
        fontSize: 11,
        color: '#3B414B',
        fontStyle: GM_FONT_FAMILY_2,
        marginLeft: 7
    },
    statsIconDefaultStyle: {
        height: 12,
        width: 12
    },
    // Stats component style
    loveIconStyle: {
        tintColor: '#EB5757'
    },
    loveTextStyle: {
    },
    shareIconStyle: {
        tintColor: '#6FCF97',
        marginLeft: 18,
        width: 14,
        height: 14
    },
    shareTextStyle: {
    },
    commentIconStyle: {
        tintColor: '#F1BF74'
    },
    commentTextStyle: {
    }
};

export default connect(
    null,
    {
        openGoalDetail
    }
)(ProfileGoalCard2);
