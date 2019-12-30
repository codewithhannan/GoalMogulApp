import * as Segment from 'expo-analytics-segment';
import { SEGMENT_CONFIG } from '../../config';

const initSegment = () => {
    Segment.initialize({ iosWriteKey: SEGMENT_CONFIG.IOS_WRITE_KEY });
};

const identify = (userId, username) => {
    Segment.identify(userId);
};

const identifyWithTraits = (userId, trait) => {
    Segment.identifyWithTraits(userId, trait);
};

const track = (event) => {
    Segment.track(event);
};

const trackViewScreen = (screenName) => {
    Segment.screen(screenName);
};

const resetUser = () => {
    Segment.reset();
};

export { resetUser, trackViewScreen, track, identify, initSegment,
    identifyWithTraits };