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
import PriorityBar from '../../Common/PriorityBar';
import DelayedButton from '../../Common/Button/DelayedButton';

// Assets
import LoveIcon from '../../../asset/utils/love.png';
import CommentIcon from '../../../asset/utils/comment.png';
import ShareIcon from '../../../asset/utils/forward.png';

// Actions
import { openGoalDetail } from '../../../redux/modules/home/mastermind/actions';
import { DEFAULT_STYLE, BACKGROUND_COLOR } from '../../../styles';

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
                        ...DEFAULT_STYLE.smallTitle_1,
                        alignSelf: 'center'
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
                    ...DEFAULT_STYLE.normalText_1,
                    flex: 1,
                    flexWrap: 'wrap'
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
            <View style={styles.statsContainerStyle}>
                <View style={{ flexDirection: 'row' }}>
                    <StatsComponent
                        iconSource={LoveIcon}
                        iconStyle={styles.loveIconStyle}
                        text={likeCount}
                    />
                    <StatsComponent
                        iconSource={ShareIcon}
                        iconStyle={styles.shareIconStyle}
                        text={shareCount}
                        containerStyle={{ marginLeft: 18 }}
                    />
                </View>
                <StatsComponent
                    iconSource={CommentIcon}
                    iconStyle={styles.commentIconStyle}
                    text={commentCount + ' Comment' + (commentCount !== 1 ? 's' : '')}
                />
            </View>
        );
    }

    renderPriorityBar(item) {
        const { priority } = item;
        return (
            <View style={{ alignItems: 'center', marginLeft: 16 }}>
                <Text style={DEFAULT_STYLE.smallText_2}>Priority</Text>
                <PriorityBar priority={priority} />
            </View>
        );
    }

    render() {
        const { item } = this.props;
        if (!item || _.isEmpty(item)) return null;

        const cardOpacity = 1;
        const backgroundColor = item.isCompleted ? '#F6F6F6' : BACKGROUND_COLOR;
        return (
            <View>
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
                <View style={DEFAULT_STYLE.shadow}/>
            </View>
        );
    }
}

const StatsComponent = (props) => {
    const { iconStyle, textStyle, iconSource, text, containerStyle } = props;
    return (
        <View style={{
            marginTop: 3,
            marginBottom: 3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            ...containerStyle
        }}>
            <Image source={iconSource} style={{ ...DEFAULT_STYLE.smallIcon_1, ...iconStyle }} />
            <Text style={{ ...DEFAULT_STYLE.smallText_1, marginLeft: 7, ...textStyle }}>{text}</Text>
        </View>
    );
};

const styles = {
    cardContainerStyle: {
        padding: 16,
        backgroundColor: BACKGROUND_COLOR,
        borderRadius: 2
    },
    headerContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        marginBottom: 8
    },
    // Stats component default style
    statsContainerStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    // Stats component style
    loveIconStyle: {
        tintColor: '#EB5757'
    },
    shareIconStyle: {
        tintColor: '#6FCF97',
        ...DEFAULT_STYLE.buttonIcon_1
    },
    commentIconStyle: {
        tintColor: '#F1BF74'
    }
};

export default connect(
    null,
    {
        openGoalDetail
    }
)(ProfileGoalCard2);
