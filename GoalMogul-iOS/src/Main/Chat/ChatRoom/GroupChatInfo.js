/**
 * ********************************************************
 * FILENAME: GroupInfo.js    TYPE: Component
 *
 * DESCRIPTION:
 *      Info page for group chat.
 *
 * AUTHER: Yanxiang Lan     START DATE: 26 June 20
 * UTILIZES: UI Kitten
 * *********************************************************
 *
 * @format
 * @see https://akveo.github.io/react-native-ui-kitten/docs/
 */

import React, { useState } from 'react'
import {
    Text,
    Input,
    Layout,
    withStyles,
    Menu,
    MenuItem,
    Icon,
} from '@ui-kitten/components'
import { Actions } from 'react-native-router-flux'
import { MenuProvider } from 'react-native-popup-menu'
import { ScrollView, StyleSheet } from 'react-native'

import ModalHeader from '../../Common/Header/ModalHeader'
import { Divider } from 'react-native-elements'

// Icons
function ForwardIcon(props) {
    return <Icon {...props} name="arrow-ios-forward" />
}

function BellIcon(props) {
    return <Icon {...props} name="bell-outline" />
}

// Sections
function BasicInfoSection() {
    return (
        <Input
            label="*Group Message Name"
            placeholder="Enter a name for this group"
            size="large"
            style={styles.input}
        />
    )
}

function NotificationSection() {
    const [selected, setSelected] = useState(false)

    return (
        <Menu style={styles.menu}>
            <MenuItem
                title={() => <Text category="h6">Notification</Text>}
                accessoryRight={ForwardIcon}
                // TODO replace the following two attributes
                //  when wiring up functionalities
                selected={selected}
                onPress={() => setSelected(true)}
                style={styles.menuItem}
            />
        </Menu>
    )
}

class GroupChatInfo extends React.Component {
    /**
     * close current page
     */
    close() {
        Actions.pop()
    }

    render() {
        const { eva, style } = this.props

        return (
            <MenuProvider customStyles={{ backdrop: styles.backdrop }}>
                <Layout style={style}>
                    <ModalHeader
                        title="Info"
                        actionHidden={true}
                        back={true}
                        onCancel={this.close}
                        containerStyles={[
                            styles.modalContainer,
                            eva.style.backgroundPrimary,
                        ]}
                        backButtonStyle={styles.modalBackButton}
                        titleTextStyle={styles.modalTitleText}
                    />
                    <ScrollView style={styles.container}>
                        <Layout style={styles.formContainer}>
                            <BasicInfoSection />
                            <Divider />
                            <NotificationSection />
                        </Layout>
                    </ScrollView>
                </Layout>
            </MenuProvider>
        )
    }
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.styles.backgroundPrimary;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 */
const mapThemeToStyles = (theme) => ({
    backgroundPrimary: {
        backgroundColor: theme['color-primary-500'],
    },
})

const styles = StyleSheet.create({
    backdrop: {},
    container: {
        height: '100%',
    },
    modalContainer: {
        elevation: 3,
        shadowColor: '#666',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    modalBackButton: {
        tintColor: '#fff',
    },
    modalTitleText: {
        color: '#fff',
    },
    formContainer: {},
    input: {
        padding: 16,
    },
    menu: {
        marginVertical: 16,
    },
    menuItem: {
        paddingVertical: 16,
        paddingLeft: 24,
    },
})

export default withStyles(GroupChatInfo, mapThemeToStyles)
