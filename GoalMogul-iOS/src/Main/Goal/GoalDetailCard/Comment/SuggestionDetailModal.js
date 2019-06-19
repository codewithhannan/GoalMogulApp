import React from 'react';
import {
    View,
    Image,
    Dimensions,
    Text
} from 'react-native';
import { Constants } from 'expo';
import Modal from 'react-native-modal';
import cancel from '../../../../asset/utils/cancel_no_background.png';
import DelayedButton from '../../../Common/Button/DelayedButton';

const { width } = Dimensions.get('window');

class SuggestionDetailModal extends React.PureComponent {
    closeModal() {
        this.props.closeModal && this.props.closeModal();
    }

    render() {
        const { suggestion } = this.props;
        if (!suggestion) return null;

        const { suggestionText, suggestionLink, suggestionType } = suggestion;

        const title = suggestionType === 'NewNeed' ? 'Suggested Need' : 'Suggested Step';
        // console.log('modal is up with visibilit: ', this.props.isVisible);

        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.7}
                onSwipe={() => this.closeModal()}
                swipeDirection='down'
                style={{ flex: 1, margin: 0, marginTop: Constants.statusBarHeight + 5 }}
                deviceWidth={width + 100}
            >
                <View style={styles.containerStyle}>
                    <View style={styles.headerContainerStyle}>
                        <DelayedButton
                            activeOpacity={0.6}
                            onPress={() => this.closeModal()}
                            style={{ position: 'absolute', top: 5, left: 5, padding: 12 }}
                        >
                            <Image
                                source={cancel}
                                style={{
                                    ...styles.cancelIconStyle,
                                    tintColor: 'gray'
                                }}
                            />
                        </DelayedButton>
                        <Text style={styles.titleTextStyle}>{title}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
                        <Text style={styles.contentTextStyle}>{suggestionText}</Text>
                    </View>
                    {/* <RichText 
                        contentText={suggestionLink}
                        textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12 }}
                        textContainerStyle={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}
                    /> */}
                </View>
            </Modal>
        );
    }
};

const styles = {
    containerStyle: {
        flex: 1, 
        // marginTop: 5, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    headerContainerStyle: {
        width: '100%',
        borderBottomWidth: 0.5, 
        borderColor: 'lightgray',
        alignItems: 'center'
    },
    titleTextStyle: {
        margin: 14,
        fontSize: 17,
        fontWeight: '500'
    },
    cancelIconStyle: {
        height: 16,
        width: 16,
    },
    contentTextStyle: {
        fontSize: 14, lineHeight: 16
    }
    
};

export default SuggestionDetailModal;