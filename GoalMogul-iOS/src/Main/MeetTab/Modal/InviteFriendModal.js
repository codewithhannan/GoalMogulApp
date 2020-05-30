import React from 'react';
import {
    View, Text, Image, TextInput, Keyboard, ScrollView,
    Share, Linking, Alert, Clipboard
} from 'react-native';
import * as SMS from 'expo-sms';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import ModalHeader from '../../Common/Header/ModalHeader';
import { GM_BLUE, DEFAULT_STYLE } from '../../../styles';
import cancel from '../../../asset/utils/cancel_no_background.png';
import DelayedButton from '../../Common/Button/DelayedButton';
import { generateInvitationLink } from '../../../redux/middleware/utils';

const DEBUG_KEY = "[UI InviteFriendModal]";
const DEFAULT_STATE = {
    description: "I'd love for us to keep each other inspired & motivated on our journeys. Add me on GoalMogul?",
    editEnabled: false
}

const EXCLUDE_ACTIVITY_TYPE = ["com.apple.reminders.RemindersEditorExtension", "com.apple.mobilenotes.SharingExtension"];

const DEFAULT_CARDS = [{
    text: "Messenger",
    image: undefined,
    deepLink: "fb-messenger://",
    deepLinkFormat: (text, url) => {
        return `fb-messenger://share?&link=${url}&message=${text}`
    }
}, {
    type: "sms",
    text: "iMessage",
    image: undefined,
}, {
    type: "email",
    text: "Email",
    image: undefined,
}, {
    type: "clipboard",
    text: "Copy",
    image: undefined,
}, {
    type: "native",
    text: "More"
}];

class InviteFriendModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    updateDescription = (text) => {
        this.setState({
            ...this.state, description: text
        });
    }

    closeModal = () => {
        if (this.props.closeModal) {
            this.props.closeModal();
            this.setState({ ...DEFAULT_STATE });
        }
    }

    inviteSms = async (message, url) => {
        const isAvailable = await SMS.isAvailableAsync();
        console.log(`${DEBUG_KEY}: SMS is available?`, isAvailable);
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync(
                [],
                `${message}\n\n${url}`
            );
            console.log(`${DEBUG_KEY}: result is: `, result);
        }
    }

    inviteEmail = (message, url) => {

    }

    inviteNative = (message, url) => {
        Share.share({ title: undefined, message, url }, {
            excludedActivityTypes: EXCLUDE_ACTIVITY_TYPE
        });
    }

    copyToClipboard = async (message, url) => {
        await Clipboard.setString(`${message}\n\n${url}`);
        Alert.alert("Copied to clipboard");
    }

    handleDeepLink = async (item) => {
        const { type, dl, deepLinkFormat } = item;
        const inviteLink = generateInvitationLink(this.props.inviteCode);
        if (type == "sms") {
            return this.inviteSms(this.state.description, inviteLink);
        }

        if (type == "native") {
            return this.inviteNative(this.state.description, inviteLink);
        }

        if (type == "clipboard") {
            return this.copyToClipboard(this.state.description, inviteLink);
        }

        const canOpen = await Linking.canOpenURL(dl);
        console.log("canOpen", canOpen);
        if (canOpen) {
            const fullLink = deepLinkFormat ? deepLinkFormat(this.state.description, inviteLink) : dl;
            await Linking.openURL(fullLink);
        }
    }

    handleEditDescriptionOnClick = () => {
        const editEnabled = this.state.editEnabled;
        this.setState({
            ...this.state, editEnabled: !editEnabled
        }, () => {
            // Original enabled and now disabled
            if (editEnabled) {
                // Dismiss keyboard
                Keyboard.dismiss();
            } else {
                // Originally disabled and now enabled. Focus on input
                this.input.focus();
            }
        });
    }

    renderCard = (item) => {
        if (!item) return null; 
        const { text, image } = item;

        return (
            <DelayedButton style={[{ width: "100%", minHeight: 70 }]} onPress={() => this.handleDeepLink(item)}>
                <View style={[styles.boxContainerStyle, { flexDirection: "row", flex: 1, alignItems: "center" }]}>
                    <Text style={[DEFAULT_STYLE.titleText_2, { fontWeight: "300" }]}>{text}</Text>
                    <View style={{ flex: 1 }} />
                </View>
                <View style={{ width: "100%", height: 1, backgroundColor: "#E0E0E0" }} />
            </DelayedButton>
        )
    }

    render() {
        const link = "web.goalmogul.com/invite/abc123";
        
        return (
            <Modal
                isVisible={this.props.isVisible}
                backdropOpacity={0.5}
                coverScreen={true}
                style={{ marginBottom: 0, marginHorizontal: 0 }}
            >
                <View style={{ backgroundColor: "#F2F2F2", top: 30, bottom: 0, left: 0, right: 0, position: "absolute", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                    <View style={[styles.boxContainerStyle, { flexDirection: "row", marginBottom: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                        <Text style={[DEFAULT_STYLE.titleText_1]}>Share</Text>
                        <View style={{ flex: 1, alignItems: "center" }} />
                        <DelayedButton activeOpacity={0.85}
                            onPress={this.closeModal}
							style={{
								width: 24,
								height: 24,
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<Image
								source={cancel}
								style={{ width: 16, height: 16, tintColor: 'black', padding: 2 }}
							/>
						</DelayedButton>
                    </View>
                    <ScrollView
                        contentContainerStyle={{ flex: 1 }}
                    >
                        <View style={[styles.boxContainerStyle, { marginBottom: 1 }]}>
                            <View style={{ borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 5, padding: 20, justifyContent: "center" }}>
                                <TextInput
                                    ref={input => {this.input = input}}
                                    defaultValue={this.state.description}
                                    onChangeText={(text) => this.updateDescription(text)}
                                    style={[DEFAULT_STYLE.subTitleText_1, { paddingTop: 0 }]}
                                    multiline
                                    editable={this.state.editEnabled}
                                />
                                <Text style={[DEFAULT_STYLE.titleText_1, { color: GM_BLUE, textDecorationLine: 'underline' }]}>{link}</Text>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flex: 1 }} />
                                <DelayedButton onPress={this.handleEditDescriptionOnClick}>
                                    <Text style={[DEFAULT_STYLE.smallTitle_1, { fontSize: 14, padding: 10 }]}>
                                        {this.state.editEnabled ? "Save Description" : "Edit Invite Description"}
                                    </Text>
                                </DelayedButton>
                                {/* <DelayedButton>
                                    <Text style={[DEFAULT_STYLE.smallTitle_1, { fontSize: 14, padding: 10 }]}>Customize Username</Text>
                                </DelayedButton> */}
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: "white" }}>
                            {
                                DEFAULT_CARDS.map(i => this.renderCard(i))
                            }
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    }
}

const styles = {
    boxContainerStyle: {
        padding: 16,
        backgroundColor: "white",
    },
    buttonContainerStyle: {
        paddingVertical: 10,
        backgroundColor: GM_BLUE,
        alignItems: "center",
        borderRadius: 5
    }
}

const mapStateToProps = state => {
    const { user } = state.user;
    const { inviteCode } = user;

    return {
        user,
        inviteCode
    }
};

export default connect(
    mapStateToProps,
    null
)(InviteFriendModal);