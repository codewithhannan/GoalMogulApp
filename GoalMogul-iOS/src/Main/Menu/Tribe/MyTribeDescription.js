import React, { Component } from 'react';
import { Dimensions, Text, View, Image} from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import flagIcon from '../../../asset/icons/flag.png'

import SearchBarHeader from '../../Common/Header/SearchBarHeader';


const { width } = Dimensions.get('window');

class MyTribeDescription extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <View style={styles.containerStyle}>
                    <SearchBarHeader
                        backButton
                        onBackPress={() => Actions.pop()}
                    />
                    
                    <View style={styles.aboutContainer}>
                        <View style={styles.aboutTitle}>
                            <Image source={flagIcon} style={styles.imageIcon}/>
                            <Text style={styles.header}>About</Text>
                        </View>
                        {/* Description from Tribe Info. */}
                        <Text>{this.props.item.description}</Text>
                    </View>
                </View>
            </MenuProvider>
        );
    }
}

const styles = {
    containerStyle: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    aboutContainer: {
        padding: 20,
    },
    header: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '700' 
    },
    aboutTitle: {
        flexDirection: 'row',
    },
    imageIcon: {
        marginTop: 5,
        marginRight: 10,
    }
};

export default connect(
)(MyTribeDescription);