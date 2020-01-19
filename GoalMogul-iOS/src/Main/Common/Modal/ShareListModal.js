/**
 * This modal is to display the user list that like a goal / post / comment
 * NOTE: before entering a profile, modal is closed first or not
 */
import React from 'react';
import { View, FlatList, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import cancel from '../../../asset/utils/cancel_no_background.png';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import DelayedButton from '../Button/DelayedButton';
import { ModalHeaderStyle } from './Styles';
import { getShareList } from '../../../redux/modules/feed/post/PostActions';
import ProfilePostCard from '../../Post/PostProfileCard/ProfilePostCard';

const DEBUG_KEY = '[ UI ShareListModal ]';
const MODAL_TRANSITION_TIME = 300;
const INITIAL_STATE = {
    data: [], // User like list
    refreshing: false
};

/**
 * NOTE: props for this Modal is: 
 * {
 *      closeModal, entityType, entityId, isVisible
 * }
 */
class ShareListModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal();
    }

    refreshShareList = () => {
        this.setState({ ...this.state, refreshing: true });
        const callback = (data) => {
            this.setState({
                ...this.state,
                data
            });
        };

        this.props.getShareList(this.props.entityType, this.props.entityId, callback);
    }

    onModalShow = () => {
        this.refreshShareList();
    }

    onModalHide = () => {
        if (this.props.clearDataOnHide) {
            this.setState({ ...INITIAL_STATE });
        }
    }

    _keyExtractor = (item) => item._id;

    renderItem = ({ item }) => {
        if (!item) {
            console.warn(`${DEBUG_KEY}: item is null`);
            return null;
        }

        const callback = (actionsToDoAfterClosingModal) => {
            this.closeModal();
            // Wait till animation finished. Default for react native modal is 300
            setTimeout(() => {
                if (actionsToDoAfterClosingModal) {
                    actionsToDoAfterClosingModal();
                }
            }, MODAL_TRANSITION_TIME);
        }

        return (
            <ProfilePostCard 
                item={item}
                hasActionButton={false}
                showRefPreview={false}
                actionDecorator={callback}
                hasCaret={false}
            />
        );
    }

    renderHeader() {
        return (
            <View style={ModalHeaderStyle.headerContainerStyle}>
                <DelayedButton
                    testID="share-list-modal-close-button"
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={{ position: 'absolute', top: 5, left: 5, padding: 12 }}
                >
                    <Image
                        source={cancel}
                        style={{ ...ModalHeaderStyle.cancelIconStyle, tintColor: '#21364C' }}
                    />
                </DelayedButton>
                <View 
                    style={{
                        marginHorizontal: 17,
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}
                >
                    <Text style={ModalHeaderStyle.headerTextStyle}>Shares</Text>
                </View>
            </View>
        );
    }

    render() {
        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.5}
                onModalShow={this.onModalShow}
                onModalHide={this.onModalHide.bind(this)}
                // swipeDirection='down'
                // onSwipe={this.closeModal.bind(this)}
                hideModalContentWhileAnimating
                style={{ flex: 1, marginTop: Constants.statusBarHeight + 15, backgroundColor: 'white', borderTopRightRadius: 15, borderTopLeftRadius: 15, marginHorizontal: 0, marginBottom: 0 }}
            >
                {this.renderHeader()}
                <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    contentContainerStyle={{ marginTop: 10 }}
                    refreshing={this.state.refreshing}
                />
            </Modal>
        );
    }
}

export default connect(
    null,
    {
        getShareList   
    }
)(ShareListModal);