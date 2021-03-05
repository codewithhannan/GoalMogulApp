/** @format */

import Constants from 'expo-constants'
import React from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import Modal from 'react-native-modal'
import cancel from '../../../../asset/utils/cancel_no_background.png'
import { getProfileImageOrDefaultFromUser } from '../../../../redux/middleware/utils'
import DelayedButton from '../../../Common/Button/DelayedButton'
import ProfileImage from '../../../Common/ProfileImage'

const { width } = Dimensions.get('window')

class SuggestionDetailModal extends React.PureComponent {
    closeModal() {
        this.props.closeModal && this.props.closeModal()
    }

    renderHeader() {
        const { owner } = this.props
        let headerText
        if (owner && owner.name) {
            headerText = owner.name
        }

        return (
            <View style={styles.headerContainerStyle}>
                <DelayedButton
                    activeOpacity={0.6}
                    onPress={() => this.closeModal()}
                    style={{
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        padding: 12,
                    }}
                >
                    <Image
                        source={cancel}
                        style={{
                            ...styles.cancelIconStyle,
                            // tintColor: 'gray'
                            tintColor: '#21364C',
                        }}
                    />
                </DelayedButton>
                <View
                    style={{
                        marginHorizontal: 17,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <ProfileImage
                        imageUrl={getProfileImageOrDefaultFromUser(owner)}
                        imageStyle={styles.headerImageStyle}
                    />
                    <Text style={styles.headerTextStyle}>{headerText}</Text>
                </View>
            </View>
        )
    }

    render() {
        const { suggestion } = this.props
        if (!suggestion) return null

        const { suggestionText, suggestionType } = suggestion
        const title =
            suggestionType === 'NewNeed' ? 'Suggested Need' : 'Suggested Step'
        // console.log('modal is up with visibilit: ', this.props.isVisible);
        // console.log('item is:', this.props.owner);

        return (
            <Modal
                backdropColor={'black'}
                isVisible={this.props.isVisible}
                backdropOpacity={0.7}
                onSwipeComplete={() => this.closeModal()}
                swipeDirection="down"
                style={{
                    flex: 1,
                    margin: 0,
                    marginTop: Constants.statusBarHeight + 5,
                }}
                deviceWidth={width + 100}
            >
                <View style={styles.containerStyle}>
                    {this.renderHeader()}
                    <View style={{ paddingHorizontal: 15, paddingTop: 20 }}>
                        <Text style={styles.titleTextStyle}>{title}</Text>
                        <Text style={styles.contentTextStyle}>
                            {suggestionText}
                        </Text>
                    </View>
                    {/* <RichText 
                        contentText={suggestionLink}
                        textStyle={{ flex: 1, flexWrap: 'wrap', color: 'black', fontSize: 12 }}
                        textContainerStyle={{ flexDirection: 'row', marginTop: 5, flexWrap: 'wrap' }}
                    /> */}
                </View>
            </Modal>
        )
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        // marginTop: 5,
        backgroundColor: 'white',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    headerContainerStyle: {
        width: '100%',
        borderBottomWidth: 0.5,
        borderColor: 'lightgray',
        alignItems: 'center',
    },
    headerImageStyle: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
    },
    headerTextStyle: {
        margin: 14,
        marginHorizontal: 8,
        fontSize: 18,
        fontWeight: '500',
        color: '#21364C',
    },
    titleTextStyle: {
        marginBottom: 10,
        fontSize: 17,
        fontWeight: '500',
        color: '#21364C',
    },
    cancelIconStyle: {
        height: 16,
        width: 16,
    },
    contentTextStyle: {
        fontSize: 15,
        lineHeight: 21,
        color: '#333',
    },
}

export default SuggestionDetailModal
