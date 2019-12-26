import * as Segment from 'expo-analytics-segment';

// TODO: put into separate file
const initSegment = () => {
    Segment.initialize({ iosWriteKey: "Us6yuw9KLihsRmpihcB5OXTYwT4GDq75" });
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