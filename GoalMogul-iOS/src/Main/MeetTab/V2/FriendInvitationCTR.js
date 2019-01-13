/**
 * Entry point for user invitation banner at the top of MeetTab
 */
import React from 'react';
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';

/* Styles */
import { APP_BLUE_BRIGHT, APP_BLUE } from '../../../styles';

/* Assets */
import People from '../../../asset/utils/People.png';
import ContactSync from '../../../asset/utils/ContactSync.png';
import Friends from '../../../asset/utils/Friends.png';
import HelpBG2 from '../../../asset/utils/HelpBG2.png';

/* Constants */
const { width } = Dimensions.get('window');

class FriendInvitationCTR extends React.PureComponent {
    handleOnPress = () => {

    }

    renderInvitationButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={this.handleOnPress}
                style={styles.buttonContainerStyle}
            >
                <Text style={styles.buttonTextStyle}>Invite friends now</Text>
            </TouchableOpacity>
        );
    }

    renderBackgroundImage() {
        return (
            <View style={styles.backgroundImageContainerStyle}>
                <View style={{ flex: 1 }} />
                <View style={{ position: 'absolute', bottom: -17, right: 5 }}>
                    <Image 
                        source={Friends} 
                        style={{ alignSelf: 'flex-end', height: 3 * (width / 10) }} 
                        resizeMode='contain' 
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.containerStyle}>
                {this.renderBackgroundImage()}
                <Text style={styles.textStyle}>
                    Great friends help each other achieve more.
                </Text>
                <Text style={[styles.textStyle, styles.boldedTextStyle]}>
                    Add friends who like to get stuff done
                </Text>
                {this.renderInvitationButton()}
            </View>
        );
    }
}

const styles = {
    containerStyle: {
        width, 
        paddingTop: 15, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        backgroundColor: 'white'
    },
    buttonContainerStyle: {
        backgroundColor: APP_BLUE,
        borderRadius: 8,
        borderColor: APP_BLUE_BRIGHT,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        marginTop: 20,
        zIndex: 2,
        padding: 10,
        paddingLeft: 14,
        paddingRight: 14
    },
    buttonTextStyle: {
        fontSize: 11,
        color: 'white',
        fontWeight: '700',
    },
    textStyle: {
        fontSize: 15,
        color: '#5e5e5e',
        zIndex: 2
    },
    boldedTextStyle: {
        fontWeight: '700',
        fontSize: 17,
        marginTop: 5
    },
    // Background image styles
    backgroundImageContainerStyle: {
        zIndex: 1, 
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
};

export default FriendInvitationCTR;
