/**
 * This modal is to display the user list that like a goal / post / comment
 * NOTE: before entering a profile, modal is closed first or not
 */
import React from 'react';
import { View, FlatList, Image, Text } from 'react-native';
import { connect } from 'react-redux';
import UserCard from '../Card/UserCard';
import { getLikeList } from '../../../redux/modules/like/LikeActions';
import cancel from '../../../asset/utils/cancel_no_background.png';
import Modal from 'react-native-modal';
import { Constants } from 'expo';
import DelayedButton from '../Button/DelayedButton';
import { modalCancelIconContainerStyle, modalCancelIconStyle } from '../../../styles';

const DEBUG_KEY = '[ UI LikeListModal ]';
const MODAL_TRANSITION_TIME = 300;
const INITIAL_STATE = {
    data: [], // User like list
    loading: false
};
class LikeListModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {...INITIAL_STATE};
    }

    closeModal() {
        this.props.closeModal && this.props.closeModal();
    }

    refreshLikeList = () => {
        this.setState({ ...this.state, refreshing: true });
        const callback = (data) => {
            this.setState({
                ...this.state,
                data
            });
        };

        this.props.getLikeList(this.props.parentId, this.props.parentType, callback);
    }

    onModalShow = () => {
        this.refreshLikeList();
    }

    onModalHide = () => {
        if (this.props.clearDataOnHide) {
            this.setState({ ...INITIAL_STATE });
        }
    }

    _keyExtractor = (item) => item._id;

    renderItem = ({ item }) => {
        if (!item || !item.creator) {
            console.warn(`${DEBUG_KEY}: creator doesn't exist for item:`, item);
            return null;
        }

        const callback = (openProfileCallBack) => {
            this.closeModal();
            // Wait till animation finished. Default for react native modal is 300
            setTimeout(() => {
                openProfileCallBack();
            }, MODAL_TRANSITION_TIME);
        }
        return <UserCard item={item.creator} callback={callback} />;
    }

    renderCancelButton() {
        return (
            <View style={{ position: 'absolute', top: 0, left: 0, padding: 15 }}>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={modalCancelIconContainerStyle}
                    disabled={this.state.showGoldBagdeInfoModal}
                >
                    <Image
                        source={cancel}
                        style={modalCancelIconStyle}
                    />
                </DelayedButton>
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
                swipeDirection='down'
                onSwipe={this.closeModal.bind(this)}
                hideModalContentWhileAnimating
                style={{ flex: 1, marginTop: Constants.statusBarHeight + 15, backgroundColor: 'white', borderTopRightRadius: 15, borderTopLeftRadius: 15, marginHorizontal: 0, marginBottom: 0 }}
            >
                {this.renderCancelButton()}
                <Text style={{ color: 'rgb(0, 150, 203)', fontWeight: '500', fontSize: 22, marginTop: 18, alignSelf: 'center' }}>
                    Likes
                </Text>
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
        getLikeList   
    }
)(LikeListModal);