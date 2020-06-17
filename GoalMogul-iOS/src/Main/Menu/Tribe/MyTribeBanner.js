/**
 * This modal shows the congradulation message for user earning a new badge
 */

import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
    View, Image, Text
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import bulbIcon from '../../../asset/icons/bulb.png'

class MyTribeBanner extends React.PureComponent {
    constructor(props) {
        super(props);
    }
  
    render() {
        return (       
                <View style={{ ...styles.containerStyle}}>
                    <View style={{...styles.imageContainer}}>
                    <Image style={{...styles.imageStyle}}  source={bulbIcon}></Image> 
                    </View>

                    <View style={{...styles.aboutContainer}}>

                    <Text style={{...styles.header}}>Get tips and suggestions</Text>

                    <Text style={{...styles.copy}}>By sharing your goals to the selected tribe, you can recieve tips and suggestions even faster.</Text>

                    {/* Add your onClick handler here, for the share your goal button. */}
                    <TouchableOpacity>
                        <Text style={{...styles.link}}>Share your goal</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                
           
        );
    }
}

export default connect(
 
)(MyTribeBanner);

const styles = {
    containerStyle: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: 10
    },
    aboutContainer: {
        padding: 20,
        paddingLeft: 0,
        flex: 3,
    },
    header: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '700' 
    },
    copy: {
        fontSize: 14,
    },
    imageStyle: {
        margin: 5,
        width: 50,
        height: 50,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    link: {
        marginTop: 12,
        color: '#42C0F5'
    }
};