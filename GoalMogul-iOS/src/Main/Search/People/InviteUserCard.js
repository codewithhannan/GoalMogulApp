/**
 * Invite user card
 *
 * @format
 */

import React from 'react'
import {
    withStyles,
    Layout,
    Text,
    CheckBox,
    Button,
} from '@ui-kitten/components'
import _ from 'lodash'
import DelayedButton from '../../Common/Button/DelayedButton'
import { EVENT, trackWithProperties } from '../../../monitoring/segment'
import defaultProfilePic from '../../../asset/utils/defaultUserProfile.png'
import { IMAGE_BASE_URL } from '../../../Utils/Constants'
import { Image, View } from 'react-native'

const DEBUG_KEY = '[ UI InviteUserCard ]'

class InviteUserCard extends React.PureComponent {
    onPress = (_id) => {
        trackWithProperties(EVENT.SEARCH_RESULT_CLICKED, {
            Type: 'people',
            Id: _id,
        })
        if (this.props.onSelect && this.props.onSelect instanceof Function) {
            return this.props.onSelect(_id, this.props.item)
        }
        this.props.openProfile(_id)
    }

    renderProfileImage(item) {
        const { profile } = item
        const { image } = profile

        let imageUrl
        if (image) {
            imageUrl =
                typeof image == 'string'
                    ? `${IMAGE_BASE_URL}${image}`
                    : imageUrl
        }
        return (
            <Layout style={{ marginLeft: 16, marginRight: 8 }}>
                <View style={styles.imageContainerStyle}>
                    <Image
                        source={
                            imageUrl ? { uri: imageUrl } : defaultProfilePic
                        }
                        style={
                            imageUrl
                                ? styles.imageStyle
                                : styles.defaultImageStyle
                        }
                    />
                </View>
            </Layout>
        )
    }

    renderTag = (status) => {
        const { eva } = this.props
        const button = this.getButtonStatus(status)
        if (!button) return null
        const { buttonStatus, text } = button
        return text == 'Invited' || text == 'Requested' ? (
            <Button
                disabled
                appearance="outline"
                status={buttonStatus}
                size="small"
                activeOpacity={1}
            >
                {text}
            </Button>
        ) : (
            <Text style={styles.adminMemberTextStyle}>{text}</Text>
        )
    }

    getButtonStatus = (status) => {
        switch (status) {
            case 'invited':
                return {
                    buttonStatus: 'info',
                    text: 'Invited',
                }
            case 'requested':
                return {
                    buttonStatus: 'warning',
                    text: 'Requested',
                }
            case 'member':
                return {
                    buttonStatus: 'basic',
                    text: 'Member',
                }
            case 'admin':
                return {
                    buttonStatus: 'basic',
                    text: 'Admin',
                }
            default: {
                return undefined
            }
        }
    }

    /**
     * Return status of user
     *
     * TODO: tags should be coming from API in item rather than from the props.
     * Refactor this function once https://app.asana.com/0/1179217829906634/1183132912958225/f
     * is completed
     * @param {*} tags an oject with three fields, invited, requested and existing
     * @param {*} item item to check the status
     */
    getStatusFromTags = (tags, item) => {
        const { _id } = item
        let status = undefined
        Object.keys(tags).map((s) => {
            // One item should be in one status. If there is one already, skp the rest.
            if (status !== undefined) return
            if (_.includes(_.get(tags, s), _id)) {
                status = s
            }
        })
        return status
    }

    render() {
        const { item, tags } = this.props
        if (!item) return null

        const { _id, name, selected } = item
        const status = this.getStatusFromTags(tags, item)

        return (
            <DelayedButton
                activeOpacity={0.7}
                onPress={() => this.onPress(_id)}
                disabled={status !== undefined}
            >
                <Layout
                    style={[
                        {
                            flexDirection: 'row',
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            alignItems: 'center',
                        },
                    ]}
                >
                    <CheckBox
                        checked={
                            status !== undefined
                                ? true
                                : selected == undefined
                                ? false
                                : selected
                        }
                        onChange={() => this.onPress(_id)}
                        disabled={status !== undefined}
                    />
                    {this.renderProfileImage(item)}
                    <View style={{ flex: 1 }}>
                        <Text category="h6">{name}</Text>
                    </View>
                    {this.renderTag(status)}
                </Layout>
            </DelayedButton>
        )
    }
}

const styles = {
    imageContainerStyle: {
        borderWidth: 0.5,
        padding: 1.5,
        borderColor: 'lightgray',
        alignItems: 'center',
        height: 34,
        width: 34,
        borderRadius: 17,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    imageStyle: {
        height: 34,
        width: 34,
        borderRadius: 17,
    },
    defaultImageStyle: {
        height: 26,
        width: 26,
        borderRadius: 13,
    },
    adminMemberTextStyle: {
        color: '#42C0F5',
        fontWeight: 'bold',
        textAlign: 'right',
    },
}

/**
 * Map app theme to styles. These styles can be accessed
 * using the <eva> prop. For example,
 * const { eva } = this.props;
 * eva.style.container;
 * @see https://github.com/akveo/react-native-ui-kitten/blob/master/docs/src/articles/design-system/use-theme-variables.md
 *
 * Later on this function should be migrated to a centralized place
 */
const mapThemeToStyles = (theme) => ({
    container: {
        backgroundColor: theme['color-card-background'],
        flex: 1,
    },
})
const StyledInviteUserCard = withStyles(InviteUserCard, mapThemeToStyles)
export default StyledInviteUserCard
