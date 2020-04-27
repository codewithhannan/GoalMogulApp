import React from 'react';
import _ from "ramda";
import {
    View,
    Text
} from 'react-native';
import Modal from 'react-native-modal';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import DelayedButton from '../Common/Button/DelayedButton';
import { GM_BLUE, GM_FONT_SIZE, GM_FONT_FAMILY, GM_FONT_LINE_HEIGHT } from '../../styles';

class SyncContactInfoModal extends React.Component {

    renderUploading() {

    }

    renderFailureResult() {
        return (
            <View>
                <Text>We couldn't find any contact that is on GoalMogul.</Text>
                <Text>
                    We will securely upload 
                </Text>
            </View>
        );
    }

    render() {
        return (
            <Modal
                swipeToClose={false}
                isVisible={this.props.isOpen}
                backdropOpacity={0.5}
                onClosed={() => this.onClosed()}
                hideModalContentWhileAnimating={true}
                useNativeDriver
                avoidKeyboard
            >
                <Text></Text>
            </Modal>
        );
    }

}

export default SyncContactInfoModal;